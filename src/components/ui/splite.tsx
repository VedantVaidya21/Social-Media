'use client'

import { Suspense, lazy, useCallback, useEffect, useRef } from 'react'
import type { Application } from '@splinetool/runtime'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
	scene: string
	className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
	const containerRef = useRef<HTMLDivElement | null>(null)
	const splineRef = useRef<Application | null>(null)
	const headRef = useRef<any>(null)
	const mousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
	const initialRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
	const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
	const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
	const animationFrameRef = useRef<number | null>(null)

	// Continuous animation loop - always runs
	const animateHead = useCallback(() => {
		if (headRef.current) {
			// Smoother lerp for continuous tracking
			const lerpFactor = 0.2
			const dx = targetRotationRef.current.x - currentRotationRef.current.x
			const dy = targetRotationRef.current.y - currentRotationRef.current.y

			// Always update for smooth continuous movement
			currentRotationRef.current.x += dx * lerpFactor
			currentRotationRef.current.y += dy * lerpFactor

			// Update rotation - Spline objects use rotation property directly
			const head = headRef.current as any
			
			// Method 1: Direct rotation property (most common)
			if (head.rotation && typeof head.rotation === 'object') {
				if (typeof head.rotation.x === 'number') {
					head.rotation.x = currentRotationRef.current.x
				}
				if (typeof head.rotation.y === 'number') {
					head.rotation.y = currentRotationRef.current.y
				}
				// Also try setting the rotation object directly
				try {
					head.rotation = {
						...head.rotation,
						x: currentRotationRef.current.x,
						y: currentRotationRef.current.y,
					}
				} catch (e) {
					// Rotation might be read-only, try alternative
				}
			}
			
			// Method 2: Euler angles
			if (head.eulerAngles) {
				head.eulerAngles.x = currentRotationRef.current.x
				head.eulerAngles.y = currentRotationRef.current.y
			}
			
			// Method 3: Quaternion (if available, convert euler to quaternion)
			// For now, we'll stick with euler angles
		}

		// Continue animation loop indefinitely
		animationFrameRef.current = requestAnimationFrame(animateHead)
	}, [])

	// Find head object - try multiple common names and list all objects for debugging
	const findHeadObject = useCallback((spline: Application) => {
		// First, let's list all objects in the scene for debugging
		try {
			const scene = (spline as any).scene
			if (scene && scene.children) {
				const listAllObjects = (children: any[], depth = 0): void => {
					children.forEach((child: any) => {
						if (child.name) {
							console.log(`${'  '.repeat(depth)}Object: "${child.name}", type: ${child.constructor?.name || 'unknown'}, has rotation: ${child.rotation !== undefined}`)
						}
						if (child.children && child.children.length > 0) {
							listAllObjects(child.children, depth + 1)
						}
					})
				}
				console.log('=== All objects in Spline scene ===')
				listAllObjects(scene.children)
				console.log('=== End object list ===')
			}
		} catch (e) {
			console.warn('Could not list objects:', e)
		}

		const possibleNames = ['Head', 'head', 'Robot', 'robot', 'Head_1', 'head_1', 'RobotHead', 'robotHead', 'Character', 'character']
		
		for (const name of possibleNames) {
			try {
				const obj = spline.findObjectByName(name)
				if (obj) {
					console.log(`Found object "${name}":`, obj)
					console.log('Has rotation:', obj.rotation !== undefined)
					console.log('Rotation value:', obj.rotation)
					
					// Check if rotation exists in any form
					if (obj.rotation !== undefined || (obj as any).rotationX !== undefined || (obj as any).rotationY !== undefined) {
						console.log(`✅ Using head object: ${name}`)
						return obj
					}
				}
			} catch (e) {
				// Continue searching
			}
		}

		// If no named object found, try to find by traversing the scene
		try {
			const scene = (spline as any).scene
			if (scene && scene.children) {
				const findInChildren = (children: any[]): any => {
					for (const child of children) {
						if (child.name) {
							const nameLower = child.name.toLowerCase()
							if (nameLower.includes('head') || nameLower.includes('robot') || nameLower.includes('character')) {
								console.log(`Checking object "${child.name}"...`)
								if (child.rotation !== undefined || (child as any).rotationX !== undefined) {
									console.log(`✅ Found head object by searching: ${child.name}`)
									return child
								}
							}
						}
						if (child.children && child.children.length > 0) {
							const found = findInChildren(child.children)
							if (found) return found
						}
					}
					return null
				}
				return findInChildren(scene.children)
			}
		} catch (e) {
			console.warn('Could not traverse scene tree:', e)
		}

		console.warn('❌ Head object not found. Please check the console above for available objects.')
		return null
	}, [])

	const handleLoad = useCallback((spline: Application) => {
		console.log('Spline scene loaded!', spline)
		splineRef.current = spline
		
		// Small delay to ensure scene is fully loaded
		setTimeout(() => {
			const head = findHeadObject(spline)

			if (head) {
				headRef.current = head
				
				// Store initial rotation - try different property access methods
				let initialX = 0
				let initialY = 0
				
				if (head.rotation) {
					initialX = head.rotation.x ?? (head.rotation as any).x ?? 0
					initialY = head.rotation.y ?? (head.rotation as any).y ?? 0
				} else {
					const headAny = head as any
					initialX = headAny.rotationX ?? 0
					initialY = headAny.rotationY ?? 0
				}
				
				initialRotationRef.current = { x: initialX, y: initialY }
				currentRotationRef.current = { ...initialRotationRef.current }
				targetRotationRef.current = { ...initialRotationRef.current }

				console.log('✅ Head object initialized:', {
					object: head,
					initialRotation: initialRotationRef.current,
					hasRotation: head.rotation !== undefined
				})

				// Start animation loop if not already running
				if (animationFrameRef.current === null) {
					animationFrameRef.current = requestAnimationFrame(animateHead)
				}
			} else {
				console.error('❌ Head object not found. Check console above for available objects.')
			}
		}, 500) // Increased delay to ensure scene is fully loaded
	}, [animateHead, findHeadObject])

	// Track mouse position continuously - track even if head not found yet
	const handleMouseMove = useCallback((event: MouseEvent) => {
		if (!containerRef.current) {
			return
		}

		const rect = containerRef.current.getBoundingClientRect()
		
		// Normalize mouse position relative to container center (-1 to 1)
		const normalizedX = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2))
		const normalizedY = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2))

		// Store mouse position
		mousePositionRef.current = { x: normalizedX, y: normalizedY }

		// Calculate rotation based on mouse position (only if we have initial rotation set)
		if (headRef.current) {
			// Increased rotation limits for more noticeable movement
			const maxTiltX = Math.PI / 4 // ~45 degrees up/down
			const maxTiltY = Math.PI / 3 // ~60 degrees left/right

			// Inverse Y because in 3D, negative Y rotation looks up
			targetRotationRef.current = {
				x: initialRotationRef.current.x + (-normalizedY * maxTiltX),
				y: initialRotationRef.current.y + (normalizedX * maxTiltY),
			}
		} else {
			// Log occasionally when head is not found to help debugging
			if (Math.random() < 0.001) {
				console.log('🖱️ Mouse moving but head object not found yet. Check console for object list above.')
			}
		}
	}, [])

	// Reset to center when mouse leaves
	const handleMouseLeave = useCallback(() => {
		targetRotationRef.current = { ...initialRotationRef.current }
		mousePositionRef.current = { x: 0, y: 0 }
	}, [])

	// Set up mouse tracking - use window level to catch all mouse movements
	useEffect(() => {
		let container = containerRef.current
		if (!container) {
			// Wait for container to be available
			const checkInterval = setInterval(() => {
				container = containerRef.current
				if (container) {
					clearInterval(checkInterval)
					setupTracking()
				}
			}, 50)
			return () => clearInterval(checkInterval)
		}

		const handleWindowMouseMove = (e: MouseEvent) => {
			if (!containerRef.current) return
			
			const rect = containerRef.current.getBoundingClientRect()
			// Check if mouse is within container bounds
			if (
				e.clientX >= rect.left &&
				e.clientX <= rect.right &&
				e.clientY >= rect.top &&
				e.clientY <= rect.bottom
			) {
				handleMouseMove(e)
			}
		}

		const setupTracking = () => {
			console.log('✅ Setting up mouse tracking on container and window')
			
			container = containerRef.current
			if (!container) return

			// Track on container with capture to catch events before Spline
			container.addEventListener('mousemove', handleMouseMove, { passive: true, capture: true })
			container.addEventListener('mouseenter', () => console.log('✅ Mouse entered Spline container'))
			container.addEventListener('mouseleave', handleMouseLeave, { capture: true })

			// Also track on window as backup
			window.addEventListener('mousemove', handleWindowMouseMove, { passive: true })
		}

		setupTracking()

		return () => {
			if (container) {
				container.removeEventListener('mousemove', handleMouseMove, { capture: true } as any)
				container.removeEventListener('mouseenter', () => {}, { capture: true } as any)
				container.removeEventListener('mouseleave', handleMouseLeave, { capture: true } as any)
			}
			window.removeEventListener('mousemove', handleWindowMouseMove)
		}
	}, [handleMouseMove, handleMouseLeave])

	// Start animation loop on mount and cleanup on unmount
	useEffect(() => {
		// Start the animation loop immediately
		if (animationFrameRef.current === null) {
			animationFrameRef.current = requestAnimationFrame(animateHead)
		}

		return () => {
			if (animationFrameRef.current !== null) {
				cancelAnimationFrame(animationFrameRef.current)
				animationFrameRef.current = null
			}
		}
	}, [animateHead])

	const containerClass = ['relative w-full h-full', className].filter(Boolean).join(' ')

	return (
		<Suspense
			fallback={
				<div className="w-full h-full flex items-center justify-center">
					<span className="loader"></span>
				</div>
			}
		>
			<div 
				ref={containerRef} 
				className={containerClass}
				style={{ pointerEvents: 'auto' }}
			>
				<Spline
					scene={scene}
					className="w-full h-full"
					onLoad={handleLoad}
				/>
			</div>
		</Suspense>
	)
}

