import React from 'react'

export default function Hero() {
  return (
    <section className="py-20 text-center">
      <h1 className="font-serif text-5xl text-primary mb-4">The Strand Diner</h1>
      <p className="italic text-lg text-white/80 mb-6">Where flavours come together</p>
      <div className="flex justify-center gap-4">
        <button className="px-6 py-3 bg-primary text-white border-2 border-primary font-semibold hover:bg-primary-dark">EXPLORE MENU</button>
        <a href="#reserve" className="px-6 py-3 bg-transparent text-primary border-2 border-primary font-semibold hover:bg-primary hover:text-white">BOOK A TABLE</a>
      </div>
    </section>
  )
}


// Hero component for The Strand Diner homepage