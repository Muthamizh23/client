import React, {useState, useEffect, useCallback} from 'react'
import './PostPage.css'

function PostCard(props) {
  const [authorName, setauthorName] = useState('')

  const fetchData = useCallback(async () => {
    await fetch("http://localhost:9001/authors")
    .then((res) => res.json())
    .then((json) => {
      const user = json[props.authorId]

    setauthorName(user.firstName + ' ' + user.lastName)
    }).catch((excep)=>{
      console.log(excep);
    })
  }, [props.authorId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div className="card w-100">
      <h1>{props.title}</h1>
      <div className=" p-5 ">
        <div className="mainContent mx-auto">{props.description}</div>
      </div>
      <p className="title text-secondary">
        Date : {new Date(props.date).toLocaleDateString()}
      </p>
      <p>Author : {authorName}</p>
      <p>LIKES : {props.numLikes}</p>
    </div>
  )
}
export default PostCard
