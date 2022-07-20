import React from 'react'

const DisplayCom = ({com, post}) => {

    // permet de filtrer les resultats voulu puis de les afficher grace a map   
    const comMap = com.filter(com => com.post_id === post).map(res => (
            <div key={res.id}> 
                <div className='com'>
                    <div className='com--avatar'></div>
                    <div className='com--text'>
                        <h4>{res.firstname + " " + res.name}</h4>
                        <p className='com--text__date'>Le {res.date}</p>
                        <p className='com--text__message'>{res.comment}</p>
                    </div> 
                </div>
            </div>
    ))

    return (
        <>
        <div className='post--comContainer'>
            {comMap.length > 0 && comMap }
            {comMap.length > 0 && <hr className='post--hrSmall'></hr>}
        </div>
        <form>
            <input type='test' placeholder='Nouveau commentaire'></input>
        </form>
    </>
    )
}

export default DisplayCom