'use client';
import styles from './draw.module.css'
import { useEffect, useState } from 'react';

const RADIUS_EARTH = 6371
const BASE_SCALE = 0.02
let BASE_TIME = 0.167
const ROCKET_SCALE = 2000
const GM = 398600

let time_factor = 1
let scale_factor = 1

let isLaunched: boolean = false
let EarthImage: HTMLImageElement | null = null
let rocketImage: HTMLImageElement | null = null
let explodeImage: HTMLImageElement | null = null

let ctxSize = {width: 0, height: 0}

let rocketX: number = 0
let rocketY: number = 0
let rocketVx: number = 0
let rocketVy: number = 0
let rocketAngle: number = 0
let rocketPosition: number = 0
let payloadMass: number = 0
let fuelMass: number = 0
let fuelEfficiency: number = 0
let fuelConsumption: number = 0
let planetMass: number = 1

function toRad(deg: number) {
    return deg * Math.PI / 180
}

function launch(set_launched: Function) {
    // disable button
    const launchButton = document.getElementById("launchButton") as HTMLButtonElement
    launchButton.classList.remove("hover:bg-green-800", "hover:text-white")
    launchButton.classList.add("cursor-not-allowed")
    launchButton.disabled = true

    // enable button
    const resetButton = document.getElementById("resetButton") as HTMLButtonElement
    resetButton.classList.add("hover:bg-red-800", "hover:text-white")
    resetButton.classList.remove("cursor-not-allowed")
    resetButton.disabled = false

    rocketInit()

    isLaunched = true
    set_launched(isLaunched)
}

function reset(set_launched: Function) {
    // enable button
    const launchButton = document.getElementById("launchButton") as HTMLButtonElement
    launchButton.classList.add("hover:bg-green-800", "hover:text-white")
    launchButton.classList.remove("cursor-not-allowed")
    launchButton.disabled = false

    // disable button
    const resetButton = document.getElementById("resetButton") as HTMLButtonElement
    resetButton.classList.remove("hover:bg-red-800", "hover:text-white")
    resetButton.classList.add("cursor-not-allowed")
    resetButton.disabled = true

    isLaunched = false
    set_launched(isLaunched)

    rocketInit()
}

/*
function convertCoordinate(x: number, y: number, w: number, h: number) {
    const f = BASE_SCALE / scale_factor
    return {
        x: ((x - (w / 2)) * f) + (ctxSize.width / 2),
        y: ((y - (h / 2)) * f) + (ctxSize.height / 2),
        w: w * f,
        h: h * f
    }
}
*/

function drawImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, w: number, h: number, rad?: number) {
    const f = BASE_SCALE / scale_factor
    y = -y
    if (rad == undefined) {
        const dx = ((x - (w / 2)) * f) + (ctxSize.width / 2)
        const dy = ((y - (h / 2)) * f) + (ctxSize.height / 2)
        ctx.drawImage(image, dx, dy, w * f, h * f)
    } else {
        rad -= Math.PI / 2
        const cx = (x * f) + (ctxSize.width / 2)
        const cy = (y * f) + (ctxSize.height / 2)
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(-rad + Math.PI)
        ctx.drawImage(image, (-w / 2) * f, (-h / 2) * f, w * f, h * f)
        ctx.restore()
    }
}

let isStarted = false
function start() {
    if (!isStarted) {
        isStarted = true
        tick()
    }
}

let set_vx: Function | null
let set_vy: Function | null
let set_x: Function | null
let set_y: Function | null
function tick() {
    const ctx = (document.getElementById("viewport") as HTMLCanvasElement).getContext("2d")
    if (!ctx) return;

    // clear viewport
    ctx.clearRect(0, 0, ctxSize.width, ctxSize.height)

    // draw planet
    if (EarthImage) {
        drawImage(ctx, EarthImage, 0, 0, RADIUS_EARTH * 2, RADIUS_EARTH * 2)
        //ctx.drawImage(EarthImage, pos.x, pos.y, pos.w, pos.h)
    }

    // update rocket state
    let isExploded = false
    if (isLaunched) {
        for (let i = 0; i < time_factor; i++) {
            const r2 = (rocketX * rocketX + rocketY * rocketY)

            if (Math.sqrt(r2) > RADIUS_EARTH - 2) {

                const g = (GM * planetMass / r2) * BASE_TIME
                const f = (fuelMass > 0) ? fuelConsumption * fuelEfficiency * BASE_TIME / (payloadMass + fuelMass) : 0
                
                if (fuelMass > 0) fuelMass -= fuelConsumption * BASE_TIME
                
                //console.log('rx, ry: ', rocketX, rocketY)
                if (rocketX < 1) {
                    rocketVy += rocketY > 0 ? -g : g
                } else {
                    const rtan = rocketY / rocketX
                    const rsin = rtan / Math.sqrt(rtan * rtan + 1)
                    const rcos = 1 / Math.sqrt(rtan * rtan + 1)
                    rocketVx += rocketX >= 0 ? -g * rcos : g * rcos
                    rocketVy += rocketY >= 0 ? -g * rsin : g * rsin
                }

                if (rocketVx < 0.003) {
                    //rocketAngle = Math.PI / 2
                } else {
                    rocketAngle = Math.atan(rocketVy / rocketVx)
                }
                
                //console.log('c', f * Math.cos(rocketAngle), f * Math.sin(rocketAngle))
                
                rocketVx += f * Math.cos(rocketAngle)
                rocketVy += f * Math.sin(rocketAngle)
                
                rocketX += rocketVx
                rocketY += rocketVy
                
            } else {
                isExploded = true
            }
        }
        if (set_vx) set_vx(rocketVx)
        if (set_vy) set_vy(rocketVy)
        if (set_x) set_x(rocketX)
        if (set_y) set_y(rocketY)
    }

    // draw rocket
    if (isExploded && explodeImage) {
        drawImage(ctx, explodeImage, rocketX, rocketY, ROCKET_SCALE, ROCKET_SCALE)
    } else if (rocketImage) {
        //ctx.fillStyle = "white"
        //const pos = convertCoordinate(rocketX, rocketY, ROCKET_SCALE, ROCKET_SCALE)
        const angle = (Math.PI / 2) + rocketAngle + rocketPosition
        drawImage(ctx, rocketImage, rocketX, rocketY, ROCKET_SCALE, ROCKET_SCALE, angle)
        //ctx.fillRect(pos.x, pos.y, pos.w, pos.h)
    }

    window.requestAnimationFrame(tick)
}

function rocketInit() {
    const launchPos = toRad((document.getElementById('launch_position') as HTMLInputElement).valueAsNumber)
    rocketX = RADIUS_EARTH * Math.cos(launchPos)
    rocketY = RADIUS_EARTH * Math.sin(launchPos)
    if (set_x) set_x(rocketX)
    if (set_y) set_y(rocketY)
    
    rocketAngle = toRad((document.getElementById('launch_angle') as HTMLInputElement).valueAsNumber)
    rocketPosition = toRad((document.getElementById('launch_position') as HTMLInputElement).valueAsNumber)
    rocketVx = 0
    rocketVy = 0
    payloadMass = (document.getElementById('payload_mass') as HTMLInputElement).valueAsNumber
    fuelMass = (document.getElementById('fuel_mass') as HTMLInputElement).valueAsNumber
    fuelEfficiency = (document.getElementById('fuel_efficiency') as HTMLInputElement).valueAsNumber
    fuelConsumption = (document.getElementById('fuel_consumption') as HTMLInputElement).valueAsNumber

    planetMass = (document.getElementById('planet_mass') as HTMLInputElement).valueAsNumber
}

function calcFramerate(cnt: number, ptimestamp: number, intervals: number) {
    if (cnt <= 10) {
        const timestamp = new Date().getTime()
        intervals += timestamp - ptimestamp
        window.requestAnimationFrame(() => {
            calcFramerate(cnt + 1, timestamp, intervals)
        })
    } else {
        BASE_TIME = (intervals / 10) / 1000
        console.log(BASE_TIME)
    }
}

interface controlPanelProps {
    menuOpened: boolean
}

export function ControlPanel(props: controlPanelProps) {
    useEffect(() => {
        const viewport = document.getElementById('viewport')
        viewport?.setAttribute('width', (window.innerWidth * 2).toString())
        viewport?.setAttribute('height', (window.innerHeight * 2).toString());

        (document.getElementById('resetButton') as HTMLButtonElement).disabled = true

        function onChangeLaunchPosition(angle: number) {
            rocketPosition = toRad(angle)
            if (!isLaunched) {
                const a = toRad(angle)
                rocketX = RADIUS_EARTH * Math.cos(a)
                rocketY = RADIUS_EARTH * Math.sin(a)
            }
        }
        document.getElementById('launch_position')?.addEventListener('change', (event) => { onChangeLaunchPosition((event.target as HTMLInputElement).valueAsNumber) })
        document.getElementById('launch_angle')?.addEventListener('change', (event) => { rocketAngle = toRad((event.target as HTMLInputElement).valueAsNumber) })
        
        rocketInit()
        calcFramerate(0, new Date().getTime(), 0)

        EarthImage = new Image()
        EarthImage.src = 'earth.png'
        rocketImage = new Image()
        rocketImage.src = 'rocket.png'
        explodeImage = new Image()
        explodeImage.src = 'explode.png'

        ctxSize.width = window.innerWidth * 2
        ctxSize.height = window.innerHeight * 2

        function wheelHandler(event: WheelEvent) {
            let v = scale_factor + event.deltaY / 500
            if (v >= 0.2) {
                scale_factor = Math.round(v * 10) / 10
                set_sf(scale_factor)
            }
        }

        window.addEventListener('wheel', wheelHandler)

        start()

        return () => {
            window.removeEventListener('wheel', wheelHandler)
        }
    }, [])

    const [tf, set_tf] = useState(time_factor)
    const [sf, set_sf] = useState(scale_factor)
    const [launched, set_launched] = useState(isLaunched)
    const [vx, setVx] = useState(rocketVx)
    const [vy, setVy] = useState(rocketVy)
    set_vx = setVx
    set_vy = setVy
    const [x, setX] = useState(rocketX)
    const [y, setY] = useState(rocketY)
    set_x = setX
    set_y = setY
    const altitude = Math.sqrt(x * x + y * y) - RADIUS_EARTH
    const v = Math.sqrt(vx * vx + vy * vy)

    return (
        <div>
            <div id={styles.btnGroup} className={props.menuOpened ? "border-t border-white" : ""}>
                <div>
                    <button type="button" id="launchButton" onClick={() => {launch(set_launched)}} className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-lg px-5 py-2 text-center me-2 mb-2">발사</button>
                    <button type="button" id="resetButton" onClick={() => {
                        reset(set_launched)
                    }} className="text-red-700 border border-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-semibold rounded-lg px-5 py-2 text-center me-2 mb-2 cursor-not-allowed">초기화</button>
                </div>
            </div>
            <div id={styles.timePanel}>
                <div className='inline-block w-24 text-right'>
                    <span>{tf}</span>
                    <span>배속</span>
                </div>
                <button type="button" onClick={() => {
                    if (time_factor < 5000) {
                        time_factor *= 2
                        set_tf(time_factor)
                    }
                }} className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-xl px-2.5 py-1 mb-2">+</button>
                <button type="button" onClick={() => {
                    if (time_factor >= 2) {
                        time_factor /= 2
                        set_tf(time_factor)
                    }
                }} className="text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-xl px-2.5 py-1 mb-2">-</button>
            </div>
            <div id={styles.scalePanel}>
                <div className='inline-block text-right'>
                    <span>{sf >= 1 ? sf : Math.round((1 / sf) * 100) / 100}</span>
                    <span>{sf >= 1 ? "배 축소" : "배 확대"}</span>
                </div>
            </div>
            <div id={styles.statePanel}>
                <div>
                    <span>{launched ? "발사됨" : "발사 대기중"}</span>
                </div>
                <div>
                    <span>{`고도 ${Math.abs(altitude) > 1 ? Math.floor(altitude) + 'km' : Math.floor(altitude * 1000) + 'm'}`}</span>
                </div>
                <div>
                    <span>속력 </span>
                    <span>{v >= 1 ? `${Math.floor(v)}km/s` : `${Math.floor(v * 1000)}m/s`}</span>
                </div>
            </div>
        </div>
    )
}