<h1 align="center"> 🧙‍♂️ Handling side effects with useEffect 🧙‍♂️</h1>
A side effect is a task that occurs after the page has loaded or after a component has rendered. For example, once a component is displayed, you might need to perform an action that depends on it, such as fetching data, interacting with the DOM, or setting up event listeners.

To handle side effects in React, I use the <code>useEffect</code> hook, which is designed for these situations.
## 🛠 Example without Dependencies
```javascript
useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlacesByLocation = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );
      setSortedPlaces(sortedPlacesByLocation);
    });
  }, []);
```
In the example above, <code>useEffect</code> accepts two arguments:

- A function ➡️ this is the effect you want to run.
- An array of dependencies ➡️ these determine when the effect runs again.

Essentially, useEffect runs the provided function after the component has been rendered. This trigger a re-render, which can be problematic if your component is complex or you have multiple effects.
Since the dependency array in this example is empty <code>([])</code>, the effect runs only once—after the initial render. If the array had dependencies, the effect would re-run whenever those dependencies changed. Dependencies can include functions, state, context values, and more.

## 🛠 Example with Dependencies
```javascript
useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onConfirm]);
```
In this case, the effect confirms a deletion modal action after 3 seconds. Unlike the previous example, this one includes a dependency: <code>onConfirm</code> wich is a prop that leads to a function. If <code>onConfirm</code> changes, the effect will re-run.

> [!NOTE]
> JavaScript functions are objects, so even two equal functions are not considered equal when compared.

### 🛠 Avoiding Infinite Re-renders with useCallback
To prevent infinite re-renders caused by function recreations, I use the useCallback hook. Here's how:
```javascript
const handleRemovePlace = useCallback(() => {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setIsModalOpen(false);

    const placesId = JSON.parse(localStorage.getItem("savedPlaces")) || [];
    localStorage.setItem(
      "savedPlaces",
      JSON.stringify(placesId.filter((id) => id !== selectedPlace.current))
    );
  }, []);
```
<code>useCallback</code> is similar to <code>useEffect</code> in that it accepts a function and a dependency array. However, it memoizes the function, storing it in React's internal memory. This prevents the function from being recreated unnecessarily, which is particularly helpful when it’s used as a dependency in useEffect or other hooks.

### 🛠 Cleanup Functions in useEffect
Finally, useEffect supports cleanup functions, which are essential when working with intervals, timeouts, or subscriptions. For example:
```javascript
useEffect(() => {
    const interval = setInterval(() => {
      setDeletingTime((prevTime) => prevTime - 100);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);
```
The cleanup function runs either when the component is unmounted or before the effect re-runs. This ensures that we don’t leave unnecessary intervals or subscriptions running in the background, which could cause performance issues.
---

<p align="center">🌟 This project is a practice exercise I learned from the <a href='https://www.udemy.com/course/react-the-complete-guide-incl-redux/?couponCode=ST7MT110524'>Academind's React Course</a> 🌟</p>
<p align="center">🐸 I hope this README helps you in some way! 🐸</p>
