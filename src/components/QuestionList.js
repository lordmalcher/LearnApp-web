import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import { fetchData, deleteItem } from '../helpers';
import Skeleton from './loading/Skeleton';

import '../styles/QuestionList.css';

const QuestionList = props => {
  const [questions, setQuestions] = useState([]);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const { collectionID } = props;

  const skeletonAmount = 10;
  const skeletonsList = [];
  let skeletons = null;

  useEffect(() => {
    setLoading(true);
    const response = fetchData(`api/questions/${collectionID}/`);
    response.then(res => {
      setQuestions(res.data);
      setEdit(false);
      setLoading(false);
    });
  }, [collectionID, edit]);

  const handleDelete = event => {
    const response = deleteItem(
      `api/questions/${collectionID}/${event.currentTarget.name}`
    );
    response.then(() => setEdit(true));
  };

  if (loading) {
    for (let i = 0; i < skeletonAmount; i += 1) {
      skeletonsList.push(
        <li id="skeleton-list-element" key={i}>
          <Skeleton height="14px" />
        </li>
      );
    }
    skeletons = <ul id="skeleton-list">{skeletonsList}</ul>;
  }

  const listElements = questions.map(question => (
    <li className="question-list-element" key={question.id}>
      {question.question}
      <div id="question-utils">
        <div id="question-utils-container">
          <Link
            to={`/collections/${collectionID}/${question.id}/edit`}
            className="link dark"
          >
            <button
              type="button"
              className="btn"
              id="edit-btn"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
          </Link>
          <button
            name={question.id}
            id="trash-icon"
            className="btn"
            type="button"
            onClick={handleDelete}
          >
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </div>
    </li>
  ));

  return (
    <div id="question-list-container">
      {skeletons}
      <ul id="question-list">{listElements}</ul>
    </div>
  );
};

QuestionList.propTypes = {
  collectionID: PropTypes.string.isRequired
};

export default QuestionList;
