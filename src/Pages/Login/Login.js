import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Formik } from "formik";
import NavigationBar from "../../components/NavBar/NavigationBar";
import Post from "../../components/ShortPost/ShortPost";
function Login() {
  let whichSort = useMemo(
    () =>
      window.location.pathname.split("/")[1] === "MostLikedPost"
        ? "numLikes"
        : "numComments",
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [window.location.pathname]
  );

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [whichSort , setWhichSort] = useState()

  //quick sort    time complexity  O(n*logn)
  const swap = useCallback((items, leftIndex, rightIndex) => {
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
  }, []);

  const partition = useCallback(
    (items, left, right) => {
      var pivot = items[Math.floor((right + left) / 2)], //middle element
        i = left, //left pointer
        j = right; //right pointer
      while (i <= j) {
        while (items[i][whichSort] < pivot[whichSort]) {
          i++;
        }
        while (items[j][whichSort] > pivot[whichSort]) {
          j--;
        }
        if (i <= j) {
          swap(items, i, j); //swap two elements
          i++;
          j--;
        }
      }
      return i;
    },
    [swap, whichSort]
  );

  const quickSort = useCallback(
    (items, left, right) => {
      var index;
      if (items.length > 1) {
        index = partition(items, left, right); //index returned from partition
        if (left < index - 1) {
          //more elements on the left side of the pivot
          quickSort(items, left, index - 1);
        }
        if (index < right) {
          //more elements on the right side of the pivot
          quickSort(items, index, right);
        }
      }
      return items;
    },
    [partition]
  );

  // end of quick sort
  const fetchPost = useCallback(async () => {
    let data = null;
    await fetch("http://localhost:9001/authors")
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        data = json;
      })
      .catch((excep) => {
        console.log(excep);
      });

    let result = quickSort(data, 0, data.length - 1);

    data = result.reverse().slice(0, 10);
    // console.log(data)
    setIsLoading(false);
    setPosts([...data]);
  }, [quickSort]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost, whichSort]);

  return (
    <div>
      <div className="container">
        <div className="row mb-5">
          <div className="offset-md-3 col-md-6">
            <h2 className="text-center mb-3">Sign In</h2>
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit}>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <p className="mb-2 text-danger">
                    {errors.email && touched.email && errors.email}
                  </p>
                  <input
                    className="form-control mb-3"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <p className="mb-2 text-danger">
                    {errors.password && touched.password && errors.password}
                  </p>
                  <button
                    type="submit"
                    className="mt-2"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
