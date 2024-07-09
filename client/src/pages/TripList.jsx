import { useEffect, useState } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user?._id); // Optional chaining
  const tripList = useSelector((state) => state.user?.tripList); // Optional chaining

  const dispatch = useDispatch();

  const getTripList = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/trips`, {
        method: "GET",
      });
      const data = await response.json();
      dispatch(setTripList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
    }
  };

  useEffect(() => {
    if (userId) { // Ensure userId is defined before fetching trip list
      getTripList();
    }
  }, [userId]); // Fetch trip list when userId changes

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Trip List</h1>
      <div className="list">
        {tripList && tripList.length > 0 ? (
          tripList.map(({ listingId, hostId, startDate, endDate, totalPrice, booking }) => (
            <ListingCard
              key={listingId?._id} // Optional chaining for listingId._id
              listingId={listingId?._id} // Optional chaining for listingId._id
              creator={hostId?._id} // Optional chaining for hostId._id
              listingPhotoPaths={listingId?.listingPhotoPaths} // Optional chaining for listingPhotoPaths
              city={listingId?.city}
              province={listingId?.province}
              country={listingId?.country}
              category={listingId?.category}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              booking={booking}
            />
          ))
        ) : (
          <p>No trips found.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default TripList;
