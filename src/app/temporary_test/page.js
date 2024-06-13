"use client"
import { useState } from 'react'
import Test from '../components/templates/sidebar/reports/reportSections/report_plantProduction_plantPlanning'
export default function TestPage() {

  const [html, setHtml] = useState('')

  const render = (v) => {
    setHtml(v)
  }
  return<> <div style={{width: 240}}>
    This is a test page:

    <hr/>
    <Test render={render}/>
    
  </div>
  <div dangerouslySetInnerHTML={{__html: html}}/>
  </>
  
  ;
}
