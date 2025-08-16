describe('Конструктор бургера', () => {
  const MOCK_INGREDIENTS = {
    bun: {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    main: {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    },
    sauce: {
      _id: '643d69a5c3f7b9001cfa0942',
      name: 'Соус Spicy-X',
      type: 'sauce',
      proteins: 30,
      fat: 20,
      carbohydrates: 40,
      calories: 30,
      price: 90,
      image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
    }
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.intercept('POST', '**/api/auth/login', {
      fixture: 'user.json'
    }).as('login');

    window.localStorage.setItem('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должен добавлять булку в конструктор', () => {
      cy.get('[data-cy="ingredient-bun"]').first().contains('Добавить').click();

      cy.get('[data-cy="constructor-bun-top"]').should('be.visible');
      cy.get('[data-cy="constructor-bun-bottom"]').should('be.visible');

      cy.get('[data-cy="total-price"]').should('not.contain', '0');
    });

    it('должен добавлять начинку в конструктор', () => {
      cy.get('[data-cy="ingredient-main"]')
        .first()
        .contains('Добавить')
        .click();

      cy.get('[data-cy="constructor-ingredients"]').should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );

      cy.get('[data-cy="ingredient-main"]')
        .first()
        .find('[data-cy="ingredient-count"]')
        .should('contain', '1');
    });

    it('должен добавлять соус в конструктор', () => {
      cy.get('[data-cy="ingredient-sauce"]')
        .first()
        .contains('Добавить')
        .click();

      cy.get('[data-cy="constructor-ingredients"]').should(
        'contain',
        'Соус Spicy-X'
      );

      cy.get('[data-cy="ingredient-sauce"]')
        .first()
        .find('[data-cy="ingredient-count"]')
        .should('contain', '1');
    });

    it('должен заменять булку при добавлении новой', () => {
      cy.get('[data-cy="ingredient-bun"]').first().contains('Добавить').click();

      cy.get('[data-cy="ingredient-bun"]').eq(1).contains('Добавить').click();

      cy.get('[data-cy="constructor-bun-top"]').should('have.length', 1);
      cy.get('[data-cy="constructor-bun-bottom"]').should('have.length', 1);
    });
  });

  describe('Удаление ингредиентов из конструктора', () => {
    beforeEach(() => {
      cy.get('[data-cy="ingredient-main"]')
        .first()
        .contains('Добавить')
        .click();
      cy.get('[data-cy="ingredient-sauce"]')
        .first()
        .contains('Добавить')
        .click();
    });

    it('должен удалять ингредиент из конструктора', () => {
      cy.get('[data-cy="constructor-element"]')
        .first()
        .find('[data-cy="delete-ingredient"]')
        .click();

      cy.get('[data-cy="constructor-ingredients"]').should(
        'not.contain',
        'Биокотлета из марсианской Магнолии'
      );

      cy.get('[data-cy="ingredient-main"]')
        .first()
        .find('[data-cy="ingredient-count"]')
        .should('not.exist');
    });

    it('должен обновлять общую стоимость после удаления', () => {
      cy.get('[data-cy="total-price"]').then(($price) => {
        const initialPrice = parseInt($price.text());

        cy.get('[data-cy="constructor-element"]')
          .first()
          .find('[data-cy="delete-ingredient"]')
          .click();

        cy.get('[data-cy="total-price"]').should(($newPrice) => {
          expect(parseInt($newPrice.text())).to.be.lessThan(initialPrice);
        });
      });
    });
  });

  describe('Перемещение ингредиентов в конструкторе', () => {
    beforeEach(() => {
      cy.get('[data-cy="ingredient-main"]')
        .first()
        .contains('Добавить')
        .click();
      cy.get('[data-cy="ingredient-sauce"]')
        .first()
        .contains('Добавить')
        .click();
      cy.get('[data-cy="ingredient-main"]').eq(1).contains('Добавить').click();
    });

    it('должен перемещать ингредиент вверх', () => {
      cy.get('[data-cy="constructor-element"]')
        .eq(1)
        .find('[data-cy="ingredient-name"]')
        .then(($name) => {
          const secondIngredientName = $name.text();

          cy.get('[data-cy="constructor-element"]')
            .eq(1)
            .find('[data-cy="move-up"]')
            .click();

          cy.get('[data-cy="constructor-element"]')
            .first()
            .find('[data-cy="ingredient-name"]')
            .should('contain', secondIngredientName);
        });
    });

    it('должен перемещать ингредиент вниз', () => {
      cy.get('[data-cy="constructor-element"]')
        .first()
        .find('[data-cy="ingredient-name"]')
        .then(($name) => {
          const firstIngredientName = $name.text();

          cy.get('[data-cy="constructor-element"]')
            .first()
            .find('[data-cy="move-down"]')
            .click();

          cy.get('[data-cy="constructor-element"]')
            .eq(1)
            .find('[data-cy="ingredient-name"]')
            .should('contain', firstIngredientName);
        });
    });
  });

  describe('Оформление заказа', () => {
    it('должен открывать модальное окно авторизации для неавторизованного пользователя', () => {
      window.localStorage.clear();
      cy.reload();
      cy.wait('@getIngredients');

      cy.get('[data-cy="ingredient-bun"]').first().contains('Добавить').click();
      cy.get('[data-cy="ingredient-main"]')
        .first()
        .contains('Добавить')
        .click();

      cy.get('[data-cy="order-button"]').click();

      cy.url().should('include', '/login');
    });

    it('должен создавать заказ для авторизованного пользователя', () => {
      cy.get('[data-cy="ingredient-bun"]').first().contains('Добавить').click();
      cy.get('[data-cy="ingredient-main"]')
        .first()
        .contains('Добавить')
        .click();

      cy.get('[data-cy="order-button"]').should('not.be.disabled').click();

      cy.wait('@createOrder');

      cy.get('[data-cy="order-details"]').should('be.visible');
      cy.get('[data-cy="order-number"]').should('be.visible');
    });

    it('должен очищать конструктор после успешного заказа', () => {
      cy.get('[data-cy="ingredient-bun"]').first().contains('Добавить').click();
      cy.get('[data-cy="ingredient-main"]')
        .first()
        .contains('Добавить')
        .click();

      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="close-modal"]').click();

      cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
      cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
      cy.get('[data-cy="constructor-element"]').should('not.exist');
      cy.get('[data-cy="total-price"]').should('contain', '0');
    });

    it('должен блокировать кнопку заказа без булки', () => {
      cy.get('[data-cy="ingredient-main"]')
        .first()
        .contains('Добавить')
        .click();

      cy.get('[data-cy="order-button"]').should('be.disabled');
    });

    it('должен блокировать кнопку заказа без начинки', () => {
      cy.get('[data-cy="ingredient-bun"]').first().contains('Добавить').click();

      cy.get('[data-cy="order-button"]').should('be.disabled');
    });
  });

  describe('Подсчет стоимости', () => {
    it('должен правильно подсчитывать стоимость бургера', () => {
      cy.get('[data-cy="ingredient-bun"]').first().contains('Добавить').click();

      cy.get('[data-cy="total-price"]').should('contain', '2510');

      cy.get('[data-cy="ingredient-main"]')
        .first()
        .contains('Добавить')
        .click();

      cy.get('[data-cy="total-price"]').should('contain', '2934');

      cy.get('[data-cy="ingredient-sauce"]')
        .first()
        .contains('Добавить')
        .click();

      cy.get('[data-cy="total-price"]').should('contain', '3024');
    });

    it('должен обновлять стоимость при замене булки', () => {
      cy.get('[data-cy="ingredient-bun"]').first().contains('Добавить').click();
      const firstBunPrice = 1255 * 2;

      cy.get('[data-cy="total-price"]').should(
        'contain',
        firstBunPrice.toString()
      );

      cy.get('[data-cy="ingredient-bun"]').eq(1).contains('Добавить').click();

      cy.get('[data-cy="total-price"]').should(
        'not.contain',
        firstBunPrice.toString()
      );
    });
  });

  describe('Модальные окна', () => {
    it('должен открывать модальное окно с деталями ингредиента', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="ingredient-details"]').should('be.visible');
      cy.get('[data-cy="modal-title"]').should('contain', 'Детали ингредиента');
    });

    it('должен закрывать модальное окно по клику на крестик', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();
      cy.get('[data-cy="ingredient-details"]').should('be.visible');

      cy.get('[data-cy="close-modal"]').click();
      cy.get('[data-cy="ingredient-details"]').should('not.exist');
    });

    it('должен закрывать модальное окно по клику на оверлей', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();
      cy.get('[data-cy="ingredient-details"]').should('be.visible');

      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-cy="ingredient-details"]').should('not.exist');
    });

    it('должен закрывать модальное окно по нажатию Escape', () => {
      cy.get('[data-cy="ingredient-bun"]').first().click();
      cy.get('[data-cy="ingredient-details"]').should('be.visible');

      cy.get('body').type('{esc}');
      cy.get('[data-cy="ingredient-details"]').should('not.exist');
    });
  });
});
