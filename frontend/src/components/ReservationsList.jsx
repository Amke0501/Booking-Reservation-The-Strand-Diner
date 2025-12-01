import React, { useEffect, useState } from 'react'

export default function ReservationsList({ apiRoot, date, resource, refreshKey = 0 }){
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date || !resource) return setList([])
    setLoading(true)
    fetch(`${apiRoot}/api/bookings/${date}/${encodeURIComponent(resource)}`)
      .then(r=>r.json())
      .then(data => {
        setList(data)
        setLoading(false)
      })
  }, [date, resource, refreshKey])

  async function handleCancel(id){
    if (!confirm('Cancel this booking?')) return
    await fetch(`${apiRoot}/api/bookings/${id}`, { method: 'DELETE' })
    setList(list.filter(l=>l.id !== id))
  }

  if (!date || !resource) {
    return <p style={{color:'rgba(255,255,255,0.7)'}}>Select resource and date to view bookings.</p>
  }

  return (
    <div style={{overflowX:'auto'}}>
      {loading ? (
        <p style={{color:'rgba(255,255,255,0.7)'}}>Loading...</p>
      ) : list.length === 0 ? (
        <p style={{color:'rgba(255,255,255,0.7)'}}>No bookings yet.</p>
      ) : (
        <table style={{width:'100%', borderCollapse:'collapse', color:'#fff'}}>
          <thead>
            <tr style={{borderBottom:'1px solid rgba(255,255,255,0.2)'}}>
              <th style={{textAlign:'left', padding:'12px', fontWeight:'600'}}>Time</th>
              <th style={{textAlign:'left', padding:'12px', fontWeight:'600'}}>Guest</th>
              <th style={{textAlign:'left', padding:'12px', fontWeight:'600'}}>Email</th>
              <th style={{textAlign:'center', padding:'12px', fontWeight:'600'}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map(b => (
              <tr key={b.id} style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>
                <td style={{padding:'12px'}}>{b.time}</td>
                <td style={{padding:'12px'}}>{b.name}</td>
                <td style={{padding:'12px', fontSize:'14px'}}>{b.email}</td>
                <td style={{padding:'12px', textAlign:'center'}}>
                  <button
                    onClick={() => handleCancel(b.id)}
                    style={{
                      background:'#ff6b6b',
                      color:'#fff',
                      border:'none',
                      padding:'6px 12px',
                      borderRadius:'4px',
                      cursor:'pointer',
                      fontSize:'12px'
                    }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
