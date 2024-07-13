import React, {useState, useEffect, memo, useCallback} from 'react'
import {Link} from 'react-router-dom'
function Comment(props) {
  const [userName, setUserName] = useState('')

  const fetchData = useCallback(async () => {

    await fetch("http://localhost:9001/authors")
    .then((res) => res.json())
    .then((json) => {
      const user = json[props.data.authorId]

    setUserName(user.firstName + ' ' + user.lastName)
    }).catch((excep)=>{
      console.log(excep);
    })
  }, [props.data.authorId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Link to={`/Profile/${props.data.authorId}`}>
      <li className="media p-4">
        <div>
          <img
            src={`https://joeschmoe.io/api/v1/${userName}`}
            className="mr-3 text-center"
            alt="..."
            width="50px"
          />
          <div className="media-body">
            <h5 className="mt-0 mb-1">{userName}.</h5>
            <label className="font-italic font-weight-bold">Comment:</label>
            <span className="ml-3">{props.data.text}</span>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default memo(Comment)
