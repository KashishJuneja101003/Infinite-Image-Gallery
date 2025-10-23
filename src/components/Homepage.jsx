import { useEffect, useState, useRef } from "react";
import axios from "axios";

const Homepage = () => {
  const [imgData, setImgData] = useState([]);
  const [index, setIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null); // 👈 sentinel element

  const getData = async () => {
    if (loading) return; // avoid double-fetching
    setLoading(true);

    try {
      const response = await axios.get(
        `https://picsum.photos/v2/list?page=${index}&limit=30`
      );
      setImgData((prev) => [...prev, ...response.data]); // append new data
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when index changes
  useEffect(() => {
    getData();
  }, [index]);

  // Observe when loaderRef comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          console.log("Fetching next page...");
          setIndex((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loading]);

  return (
    <div className="flex flex-col items-center">
      {/* Image Grid */}
      <div className="flex flex-wrap gap-y-5 justify-around">
        {imgData.map((elem, idx) => (
          <a
            key={idx}
            href={elem.url}
            target="_blank"
            className="h-54 rounded-2xl flex flex-col bg-amber-300"
          >
            <div className="flex flex-col items-center w-65 overflow-hidden bg-amber-50 rounded-xl">
              <img
                className="h-52 w-full object-cover rounded-t-xl"
                src={elem.download_url}
                alt=""
              />
            </div>
            <h2 className="mb-0 text-shadow-amber-900 text-shadow-md text-center text-[20px] text-white">
              {elem.author}
            </h2>
          </a>
        ))}
      </div>

      {/* Loading Indicator */}
      <div ref={loaderRef} className="my-5">
        {loading && (
          <p className="text-[18px] text-amber-600 font-semibold animate-pulse">
            Loading more images...
          </p>
        )}
      </div>
    </div>
  );
};

export default Homepage;
