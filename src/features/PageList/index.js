import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { getList } from "app/ContentModule";

const PageList = ({ type = "page" }) => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.content.list);
  useEffect(() => {
    dispatch(getList({ type }));
  }, [dispatch, type]);
  const { pending, data, error } = list;
  if (pending) {
    return <h1>Pending...</h1>;
  }
  if (error) {
    return <h1 className="PageList__error">{error.message}</h1>;
  }
  if (!data.length) {
    return <h1>No content found.</h1>;
  }
  return (
    <div>
      {data.map((item, i) => (
        <h1 className="PageList__item" key={`PageList-${i}`}>
          {item.title}
        </h1>
      ))}
    </div>
  );
};

PageList.propTypes = {
  type: PropTypes.string,
};

export default PageList;
