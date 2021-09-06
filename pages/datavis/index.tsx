import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { useState, useEffect } from "react"
import { ResponsiveNetwork } from "@nivo/network"
import nivodata from "./data/nivodata.json"

const Home: NextPage = () => {
  const [data, setData] = useState(nivodata)
  useEffect(() => {
    setData(nivodata)
  }, [nivodata])

  return (
    <div className="w-full h-[600px] p-0 m-auto bg-gray-400">
      {data ? (
        <ResponsiveNetwork
          {...data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          repulsivity={6}
          iterations={60}
          nodeColor={(e) => {
            return e.color
          }}
          nodeBorderWidth={1}
          nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
          linkThickness={(e) => {
            return 2 * (2 - e.source.depth)
          }}
          motionStiffness={160} // (弹簧)刚度
          motionDamping={12} // 阻尼；衰减，减幅
          isInteractive= {true}
          onClick={(n,e)=>{console.log(n,e)}}

          animate={true}
        />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default Home
