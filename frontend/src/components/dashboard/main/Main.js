import React from 'react'
import DisplayAllPosts from './allpost/DisplayAllPost'
import NewPost from './newpost/NewPost'

const Main = () => {
  return (
    <main>
      <NewPost />
      <DisplayAllPosts />
    </main>
  )
}

export default Main