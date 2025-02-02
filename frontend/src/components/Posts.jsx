import React from 'react'
import Post from './Post';
import { useSelector } from 'react-redux';


const Posts = () => {
  const {posts} = useSelector(store => store.post)
  return (
    <div>
       {
        posts.map((post) => <Post key={post?._id} post={post}/>)
       }
    </div>
  )
}

export default Posts

// import React from 'react';
// import Post from './Post';
// import { useSelector } from 'react-redux';

// const Posts = () => {
//   const { posts } = useSelector((store) => store.post);

//   if (!posts || !Array.isArray(posts)) {
//     return <p>No posts available</p>;
//   }

//   return (
//     <div>
//       {posts.length > 0 ? (
//         posts.map((post) => {
//           if (!post || !post._id) return null; // Skip invalid posts
//           return <Post key={post._id} post={post} />;
//         })
//       ) : (
//         <p>No posts available</p>
//       )}
//     </div>
//   );
// };

// export default Posts;
