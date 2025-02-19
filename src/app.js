/* eslint-disable no-param-reassign */

import i18next from 'i18next';
import * as yup from 'yup';
import resources from './locales/index.js';
import watch from './view.js';

export default async () => {
  const i18nextInstance = i18next.createInstance();
  // initialization ===================================
  await i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: resources.ru,
    },
  });

  // Form filling ===================================
  function createInputDiv(id, labelText, type) {
    const div = document.createElement('div');
    div.classList.add('mb-3');

    const label = document.createElement('label');
    label.classList.add('form-label');
    label.setAttribute('for', id);
    label.textContent = labelText;

    const input = document.createElement('input');
    input.classList.add('form-control');
    input.id = id;
    input.type = type;
    input.name = id;

    const errorDiv = document.createElement('div');
    errorDiv.classList.add('invalid-feedback');
    errorDiv.id = `error-${id}`;

    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(errorDiv);

    return div;
  }

  const form = document.getElementById('form');

  const heading = document.createElement('h2');
  heading.classList.add('mb-5');
  heading.textContent = 'Регистрация';

  const userNameDiv = createInputDiv('username', 'Имя пользователя', 'text');
  const passwordDiv = createInputDiv('password', 'Пароль', 'password');
  const confirmPasswordDiv = createInputDiv(
    'confirmPassword',
    'Подтвердите пароль',
    'password',
  );

  const button = document.createElement('button');
  button.type = 'submit';
  button.classList.add('btn', 'btn-primary', 'mt-3');
  button.textContent = 'Зарегистрироваться';

  form.appendChild(heading);
  form.appendChild(userNameDiv);
  form.appendChild(passwordDiv);
  form.appendChild(confirmPasswordDiv);
  form.appendChild(button);
  //------------------------------------------------------------
  // Set yup localization
  yup.setLocale({
    mixed: {
      required: ({ path }) => ({
        key: 'requiredField',
        values: { field: path },
      }),
      default: 'Invalid value',
    },
    string: {
      min: ({ min }) => ({ key: 'invalidMin', values: { count: min } }),
      max: ({ max }) => ({ key: 'invalidMax', values: { count: max } }),
    },
  });

  // Define validation schemas
  const validationSchema = yup.object({
    username: yup.string().min(3).max(10).required(),
    password: yup.string().min(6).max(12).required(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], { key: 'mustMatch' })
      .required(),
  });

  const nullifyObj = obj => {
    Object.keys(obj).forEach(key => {
      obj[key] = null;
    });
  };
  // ----------------------------------------------------------------------
  const validationState = {
    username: null,
    password: null,
    confirmPassword: null,
    errors: { username: null, password: null, confirmPassword: null },
  };

  const watchedState = watch(
    { userNameDiv, passwordDiv, confirmPasswordDiv },
    i18nextInstance,
    validationState,
  );

  button.addEventListener('click', async e => {
    e.preventDefault();
    nullifyObj(watchedState.errors);

    const formData = new FormData(form);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    };
    console.log(data); // todo

    try {
      await validationSchema.validate(data, { abortEarly: false });
    } catch (err) {
      err.inner.forEach(error => {
        watchedState.errors[error.path] = i18nextInstance.t(
          error.message.key,
          error.message.values,
        );
      });
    }

    Object.keys(watchedState.errors).forEach(key => {
      const curError = watchedState.errors[key];
      watchedState[key] = curError ? 'is-invalid' : 'is-valid';
    });
  });
};
