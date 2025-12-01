import React from 'react'

export default function Hero() {
  return (
    <section className="hero">
      <div style={{textAlign:'center'}}>
        <h1>The Strand Diner</h1>
        <p>Where favours come together</p>
        <div className="hero-buttons">
          <button className="btn primary-btn">EXPLORE MENU</button>
          <button className="btn secondary-btn">BOOK A TABLE</button>
        </div>
      </div>
    </section>
  )
}
