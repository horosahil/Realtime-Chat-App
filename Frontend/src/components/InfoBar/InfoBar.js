import React from 'react'
import './InfoBar.css'
import onlineIcon from '../../icons/check.png'
import closeIcon from '../../icons/rec.png'

function InfoBar({room}) {
    return (
        <div className="infobar">
            <div className="leftinner">
                <img className="onlineicon" src={onlineIcon} alt=""/>
                <h3>{room}</h3>
            </div>
            <div className="rightinner">
                <a href="/"><img className="closeicon" src={closeIcon} alt=""/></a>

            </div>
            
        </div>
    )
}

export default InfoBar
