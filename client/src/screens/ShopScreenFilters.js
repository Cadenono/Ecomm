import React, { useState, useEffect } from "react";
import Checkbox from "../components/Checkbox";
import { prices } from "../components/FixedPrices";
import axios from "axios";
import RadioButton from "../components/RadioButton";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

const ShopScreenFilters = () => {
  const [categories, setCategories] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [limit, setLimit] = useState(6);
  const [skip, setSkip] = useState(0);
  const [error, setError] = useState(null);
  const [size, setSize] = useState(0);
  const [myFilters, setMyFilters] = useState({
    filters: { category: [], price: [] },
  });

  const handleFilters = (filters, filterBy) => {
    console.log("SHOP", filters, filterBy);
    //FILTER BY CATEGORY
    const newFilters = { ...myFilters }; //copying an object
    newFilters.filters[filterBy] = filters;

    //FILTER BY PRICE
    if (filterBy == "price") {
      let priceValues = handlePrice(filters);
      newFilters.filters[filterBy] = priceValues;
    }
    loadFilteredResults(myFilters.filters);
    console.log(filteredResults, "filteredResults!");
    setMyFilters(newFilters);
    console.log("myfilters", myFilters);
  };

  const handlePrice = (value) => {
    const data = prices;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value)) {
        array = data[key].array;
      }
    }
    return array;
  };
  const loadFilteredResults = (newFilters) => {
    // console.log(newFilters);
    getFilteredProducts(skip, limit, newFilters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults(data.data);
        setSize(data.size);
        setSkip(0);
      }
    });
  };

  const loadMore = () => {
    let toSkip = skip + limit;
    // console.log(newFilters);
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setFilteredResults([...filteredResults, ...data.data]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };
  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-warning mb-5">
          Load more
        </button>
      )
    );
  };
  const getFilteredProducts = async (skip, limit, filters = {}) => {
    try {
      const { data } = await axios.post(`/api/products/by/search`, {
        limit,
        skip,
        filters,
      });
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`/api/category/getallcategories`);
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategories();
    loadFilteredResults(skip, limit, myFilters.filters);
  }, []);

  return (
    <>
      <Navbar />
      <div>
        <h2>Filter Products By Category</h2>
        {/* {categories && JSON.stringify(categories)} */}
        <Checkbox
          categories={categories}
          handleFilters={(filters) => handleFilters(filters, "category")}
        />
        <hr />

        <h2>Filter Products By Price Range</h2>
        <RadioButton
          prices={prices}
          handleFilters={(filters) => handleFilters(filters, "price")}
        />
        <hr />
        <div className="row">
          {filteredResults &&
            filteredResults.map((product, i) => (
              <div key={i} className="col-4 mb-3">
                <ProductCard product={product} />
              </div>
            ))}
        </div>
        {loadMoreButton()}
      </div>
    </>
  );
};

export default ShopScreenFilters;
