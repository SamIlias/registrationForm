import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080');
});

test('html', async ({ page }) => {
  await expect(page.getByText('Имя пользователя')).toBeVisible();
  await expect(page.getByText('Пароль', { exact: true })).toBeVisible();
  await expect(page.getByText('Подтвердите пароль')).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Зарегистрироваться' }),
  ).toBeVisible();
});

test('valid form', async ({ page }) => {
  await page.getByLabel('Имя пользователя').click();
  await page.getByLabel('Имя пользователя').fill('user');
  await page.getByLabel('Пароль', { exact: true }).click();
  await page.getByLabel('Пароль', { exact: true }).fill('123456');
  await page.getByLabel('Подтвердите пароль').click();
  await page.getByLabel('Подтвердите пароль').fill('123456');
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();

  await expect(page.getByLabel('Имя пользователя')).toHaveClass(
    'form-control is-valid',
  );
  await expect(page.getByLabel('Пароль', { exact: true })).toHaveClass(
    'form-control is-valid',
  );
  await expect(page.getByLabel('Подтвердите пароль')).toHaveClass(
    'form-control is-valid',
  );
});

test('invalid form', async ({ page }) => {
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
  await expect(page.getByLabel('Имя пользователя')).toHaveClass(
    'form-control is-invalid',
  );
  await expect(page.getByText('минимум 3 символа')).toBeVisible();
  await expect(page.getByLabel('Пароль', { exact: true })).toHaveClass(
    'form-control is-invalid',
  );
  await expect(page.getByText('минимум 6 символов')).toBeVisible();
  await expect(page.getByLabel('Подтвердите пароль')).toHaveClass(
    'form-control is-invalid',
  );
  await expect(page.getByText('это обязательное поле')).toBeVisible();

  await page.getByLabel('Имя пользователя').click();
  await page.getByLabel('Имя пользователя').fill('longtestingname');
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
  await expect(page.getByLabel('Имя пользователя')).toHaveClass(
    'form-control is-invalid',
  );
  await expect(page.getByText('максимум 10 символов')).toBeVisible();

  await page.getByLabel('Пароль', { exact: true }).click();
  await page.getByLabel('Пароль', { exact: true }).fill('');
  await page.getByLabel('Пароль', { exact: true }).fill('123456');
  await page.getByLabel('Подтвердите пароль').click();
  await page.getByLabel('Подтвердите пароль').fill('12345');
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
  await expect(page.getByLabel('Подтвердите пароль')).toHaveClass(
    'form-control is-invalid',
  );
  await expect(page.getByText('Пароли должны совпадать')).toBeVisible();

  await page.getByLabel('Пароль', { exact: true }).click();
  await page.getByLabel('Пароль', { exact: true }).fill('1234567891112');
  await page.getByLabel('Подтвердите пароль').click();
  await page.getByLabel('Подтвердите пароль').fill('12345678');
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
  await expect(page.getByLabel('Пароль', { exact: true })).toHaveClass(
    'form-control is-invalid',
  );
  await expect(page.getByText('максимум 12 символов')).toBeVisible();
  await expect(page.getByLabel('Подтвердите пароль')).toHaveClass(
    'form-control is-invalid',
  );
  await expect(page.getByText('Пароли должны совпадать')).toBeVisible();
});
