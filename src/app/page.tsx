"use client";
import styles from "./page.module.css";
import { ControlPanel } from "./draw"
import { useState } from "react";

export default function Page() {
  const [openMenu, setOpenMenu] = useState(true)

  return(
    <main className={styles.main + " full"}>
      <div className={styles.canvas}>
        <canvas id="viewport">

        </canvas>
      </div>
      {openMenu && <div className={styles.setting}>
        <div className={styles.settingGroup}>
          <div>로켓</div>
          <div className={styles.settingElement}>
            <span>페이로드 질량</span>
            <input type="number" id="payload_mass" defaultValue={200000} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-28 focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required min={0}></input>
            <span>kg</span>
          </div>
          <div className={styles.settingElement}>
            <span>연료 질량</span>
            <input type="number" id="fuel_mass" defaultValue={382000} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-28 focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required min={0}></input>
            <span>kg</span>
          </div>
          <div className={styles.settingElement}>
            <span>연료 효율</span>
            <input type="number" id="fuel_efficiency" defaultValue={39} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-28 focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required min={0}></input>
            <span>N/kg</span>
          </div>
          <div className={styles.settingElement}>
            <span>초당 연료 소비량</span>
            <input type="number" id="fuel_consumption" defaultValue={382} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-28 focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required min={0}></input>
            <span>kg/s</span>
          </div>
          <div className={styles.settingElement}>
            <span>발사 위치</span>
            <input type="number" id="launch_position" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-28 focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required max={360} min={0} defaultValue={90}></input>
            <span>°</span> 
          </div>
          <div className={styles.settingElement}>
            <span>발사각</span>
            <input type="number" id="launch_angle" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-28 focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required max={180} min={0} defaultValue={80}></input>
            <span>°</span>
          </div>
        </div>
        <div className={styles.settingGroup}>
          <div>행성</div>
          <div className={styles.settingElement}>
            <span>질량</span>
            <input type="number" id="planet_mass" defaultValue={1} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-28 focus:ring-blue-500 focus:border-blue-500 inline-block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required min={0}></input>
            <span>지구 질량</span>
          </div>
        </div>
        <div style={{height: "200px"}}></div>
      </div>}
      <ControlPanel menuOpened={openMenu}></ControlPanel>
      <div id={styles.toggleButton} onClick={() => {setOpenMenu(!openMenu)}}>{openMenu ? <span>&#x2BA9;</span> : <span>&#x2BA8;</span>}</div>
    </main>
  )
}