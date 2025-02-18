/* eslint-disable no-param-reassign */

import onChange from 'on-change';

export default (elements, i18n, state) => {
  const usernameInput = elements.userNameDiv.querySelector('#username');
  const usernameFeedback =
    elements.userNameDiv.querySelector('#error-username');
  const passwordInput = elements.passwordDiv.querySelector('#password');
  const passwordFeedback =
    elements.passwordDiv.querySelector('#error-password');
  const confirmPasswordInput =
    elements.confirmPasswordDiv.querySelector('#confirmPassword');
  const confirmPasswordFeedback = elements.confirmPasswordDiv.querySelector(
    '#error-confirmPassword',
  );

  const inputs = {
    username: usernameInput,
    password: passwordInput,
    confirmPassword: confirmPasswordInput,
  };

  const feedbacks = {
    username: usernameFeedback,
    password: passwordFeedback,
    confirmPassword: confirmPasswordFeedback,
  };

  const render = (path, value, prevValue) => {
    if (path.startsWith('errors')) {
      const subPath = path.split('.')[1];
      const curFeedback = feedbacks[subPath];
      curFeedback.textContent = value || '';
      return;
    }

    const curInput = inputs[path];
    curInput.classList.remove(prevValue);
    curInput.classList.add(value);
  };

  return onChange(state, render);
};
