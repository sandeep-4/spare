import React from "react";
import Jumbotron from "../components/cards/Jumbotron";
import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";
import CategoryList from "../components/category/CategoryList";
import SubList from "../components/sub/SubList";
import banner from "../images/banner2.jpg";

const Home = () => {
  return (
    <>
      {
        // <div className="jumbotron text-danger h1 font-weight-bold text-center">
        //   <Jumbotron
        //     text={[
        //       "Wel come to spare buying",
        //       "Enjoy buying",
        //       "Select your products",
        //       "Repair parts",
        //     ]}
        //   />
        // </div>
      }

      <img
        src={banner}
        style={{ height: "350px", objectFit: "cover", width: "100%" }}
        className="p-1"
      />

      <h4
        className="text-center p-3 mt-5 mb-5 display-4 "
        style={{ color: "white" }}
      ></h4>

      <NewArrivals />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Best Selling spares
      </h4>
      <BestSellers />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Categories
      </h4>
      <CategoryList />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Sub Categories
      </h4>
      <SubList />

      <br />
      <br />
    </>
  );
};

export default Home;
