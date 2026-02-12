// Altered example from Limio docs: https://developers.limio.com/limio-sdk/user
export const docUser = {
  "username": "id-c49d0d60611eb155d2cdcb0bbfab0af8",
  attributes: {
    aud: "3kde1g4qurqbdmf7p81n6568m0",
    auth_time: 1610643100,
    "cognito:username": "dummy_user",
    email: "dummy@limio.com",
    email_verified: true,
    firstName: "Alex",
    lastName: "Johnson",
    event_id: "743826f5-075c-4c36-8bb2-bf343be46f09",
    exp: 1611848843,
    iat: 1611845243,
    iss: "https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_AVrsbOxSU",
    sub: "d183e0ec-8baf-4320-b847-c78fad0b1df8",
    token_use: "id",
  },
  subscriptions: [
    {
      name: "Limio Monthly",
      data: {
        offer: {
          data: {
            attributes: {
              display_name__limio: "Pro Plan",
              price__limio: [{ type: "recurring", value: 20, currencyCode: "GBP" }],
              term__limio: { type: "months", length: 1, renewal_trigger: "auto", renewal_type: "term" }
            },
            products: [{ name: "Pro", attributes: { display_name__limio: "Pro Access", product_code__limio: "LI.PRO" } }]
          }
        }
      },
      status: "active",
      record_type: "subscription",
      owner: "id-hfmd3qJIYU8XZZo-5JI2UOkdacXd0JXBYlptgRGcLMM",
      customer: "cus-VsmB6KhU_PTTTGzgvY51Vk2dy5Hf6dLnIX4NitMaK4I",
      id: "sub-34cb9ce9a3777a164bb1ad471f20a83b",
      service: "limio",
      ref: "order-23b46e1b8f4c23f5ecd7151437afb4b6/a85cbcf1-fcbc-4320-be3f-eaacaaff578f",
      created: "2022-06-09T12:44:38.771Z",
      reference: "1KPEEEJ8RNF8",
      mode: "production",
      offers: [
        {
          name: "Pro Plan",
          data: {
            start: "2022-06-09T12:44:38.771Z",
            record_subtype: "base",
            offer: {
              data: {
                attributes: {
                  display_name__limio: "Pro Plan",
                  price__limio: [{ type: "recurring", value: 20, currencyCode: "GBP" }],
                  term__limio: { type: "months", length: 1, renewal_trigger: "auto", renewal_type: "term" }
                },
                products: [{ name: "Pro", attributes: { display_name__limio: "Pro Access", product_code__limio: "LI.PRO" } }]
              }
            }
          },
          quantity: 1,
          price: {
            summary: { headline: "£20/month" },
            currency: "GBP",
            amount: 20
          },
          products: [],
          termEndDate: "2022-09-02T10:25:01.000Z",
          attributes: { autoRenew__limio: true }
        }
      ],
      schedule: [
        {
          data: {
            date: "2022-06-09T12:44:38.771Z",
            reference: "a85cbcf1-fcbc-4320-be3f-eaacaaff578f_charge0",
            description: "Pro Plan — Monthly",
            amount: "20.00",
            currency: "GBP",
            type: "payment"
          },
          status: "active",
          record_type: "schedule",
          related: "sub-34cb9ce9a3777a164bb1ad471f20a83b",
          owner: "id-hfmd3qJIYU8XZZo-5JI2UOkdacXd0JXBYlptgRGcLMM",
          id: "schedule-46f188d94a8b0b1ef39ee1afbbebfb99",
          service: "limio",
          created: "2022-06-09T12:44:38.771Z",
          reference: "26U64DIIKB1G",
          mode: "production"
        },
        {
          data: {
            date: "2022-07-09T12:44:38.771Z",
            reference: "a85cbcf1-fcbc-4320-be3f-eaacaaff578f_charge1",
            description: "Pro Plan — Monthly",
            amount: "20.00",
            currency: "GBP",
            type: "payment"
          },
          status: "active",
          record_type: "schedule",
          related: "sub-34cb9ce9a3777a164bb1ad471f20a83b",
          id: "schedule-77a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5",
          service: "limio",
          created: "2022-07-09T12:44:38.771Z",
          reference: "38V75FJJLC2H",
          mode: "production"
        },
        {
          data: {
            date: "2027-07-09T12:44:38.771Z",
            reference: "a85cbcf1-fcbc-4320-be3f-eaacaaff578f_charge2",
            description: "Pro Plan — Monthly",
            amount: "20.00",
            currency: "GBP",
            type: "payment"
          },
          status: "active",
          record_type: "schedule",
          related: "sub-34cb9ce9a3777a164bb1ad471f20a83b",
          id: "schedule-f0899162c4c161a0f8c2535dd1526334",
          service: "limio",
          created: "2022-06-09T12:44:38.771Z",
          reference: "7GH68M5H61C0",
          mode: "production"
        }
      ]
    },
    {
      name: "Enterprise Annual",
      data: {
        offer: {
          data: {
            attributes: {
              display_name__limio: "Enterprise Plan",
              price__limio: [{ type: "recurring", value: 499, currencyCode: "GBP" }],
              term__limio: { type: "years", length: 1, renewal_trigger: "auto", renewal_type: "term" }
            },
            products: [{ name: "Enterprise", attributes: { display_name__limio: "Enterprise Access", product_code__limio: "LI.ENT" } }]
          }
        }
      },
      status: "active",
      record_type: "subscription",
      owner: "id-hfmd3qJIYU8XZZo-5JI2UOkdacXd0JXBYlptgRGcLMM",
      customer: "cus-VsmB6KhU_PTTTGzgvY51Vk2dy5Hf6dLnIX4NitMaK4I",
      id: "sub-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
      service: "limio",
      ref: "order-bbcc1122/ee44ff55-6677-8899-aabb-ccddeeff0011",
      created: "2024-03-15T09:30:00.000Z",
      reference: "2ABCDEF12345",
      mode: "production",
      offers: [
        {
          name: "Enterprise Plan",
          data: {
            start: "2024-03-15T09:30:00.000Z",
            record_subtype: "base",
            offer: {
              data: {
                attributes: {
                  display_name__limio: "Enterprise Plan",
                  price__limio: [{ type: "recurring", value: 499, currencyCode: "GBP" }],
                  term__limio: { type: "years", length: 1, renewal_trigger: "auto", renewal_type: "term" }
                },
                products: [{ name: "Enterprise", attributes: { display_name__limio: "Enterprise Access", product_code__limio: "LI.ENT" } }]
              }
            }
          },
          quantity: 1,
          price: {
            summary: { headline: "£499/year" },
            currency: "GBP",
            amount: 499
          },
          products: [],
          attributes: { autoRenew__limio: true }
        }
      ],
      schedule: [
        {
          data: {
            date: "2024-03-15T09:30:00.000Z",
            reference: "ee44ff55-charge0",
            description: "Enterprise Plan — Annual",
            amount: "499.00",
            currency: "GBP",
            type: "payment"
          },
          status: "active",
          record_type: "schedule",
          related: "sub-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
          id: "schedule-ent-001",
          service: "limio",
          created: "2024-03-15T09:30:00.000Z",
          reference: "ENT001PAY",
          mode: "production"
        },
        {
          data: {
            date: "2027-03-15T09:30:00.000Z",
            reference: "ee44ff55-charge1",
            description: "Enterprise Plan — Annual",
            amount: "499.00",
            currency: "GBP",
            type: "payment"
          },
          status: "active",
          record_type: "schedule",
          related: "sub-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
          id: "schedule-ent-002",
          service: "limio",
          created: "2024-03-15T09:30:00.000Z",
          reference: "ENT002PAY",
          mode: "production"
        }
      ]
    },
    {
      name: "Starter Monthly",
      data: {
        offer: {
          data: {
            attributes: {
              display_name__limio: "Starter Plan",
              price__limio: [{ type: "recurring", value: 5, currencyCode: "GBP" }],
              term__limio: { type: "months", length: 1, renewal_trigger: "auto", renewal_type: "term" }
            },
            products: [{ name: "Starter", attributes: { display_name__limio: "Starter Access", product_code__limio: "LI.START" } }]
          }
        }
      },
      status: "cancelled",
      record_type: "subscription",
      owner: "id-hfmd3qJIYU8XZZo-5JI2UOkdacXd0JXBYlptgRGcLMM",
      customer: "cus-VsmB6KhU_PTTTGzgvY51Vk2dy5Hf6dLnIX4NitMaK4I",
      id: "sub-cancelled-111222333444",
      service: "limio",
      ref: "order-old-sub/ff112233-4455-6677-8899-aabbccddeeff",
      created: "2021-11-01T08:00:00.000Z",
      reference: "3XYZSTART789",
      mode: "production",
      offers: [
        {
          name: "Starter Plan",
          data: {
            start: "2021-11-01T08:00:00.000Z",
            end: "2022-05-01T08:00:00.000Z",
            record_subtype: "base",
            offer: {
              data: {
                attributes: {
                  display_name__limio: "Starter Plan",
                  price__limio: [{ type: "recurring", value: 5, currencyCode: "GBP" }],
                  term__limio: { type: "months", length: 1, renewal_trigger: "auto", renewal_type: "term" }
                },
                products: [{ name: "Starter", attributes: { display_name__limio: "Starter Access", product_code__limio: "LI.START" } }]
              }
            }
          },
          quantity: 1,
          price: {
            summary: { headline: "£5/month" },
            currency: "GBP",
            amount: 5
          },
          products: [],
          attributes: { autoRenew__limio: false }
        }
      ],
      schedule: [
        {
          data: {
            date: "2021-11-01T08:00:00.000Z",
            reference: "ff112233-charge0",
            description: "Starter Plan — Monthly",
            amount: "5.00",
            currency: "GBP",
            type: "payment"
          },
          status: "active",
          record_type: "schedule",
          related: "sub-cancelled-111222333444",
          id: "schedule-start-001",
          service: "limio",
          created: "2021-11-01T08:00:00.000Z",
          reference: "START001PAY",
          mode: "production"
        },
        {
          data: {
            date: "2022-04-01T08:00:00.000Z",
            reference: "ff112233-charge5",
            description: "Starter Plan — Monthly",
            amount: "5.00",
            currency: "GBP",
            type: "payment"
          },
          status: "cancelled",
          record_type: "schedule",
          related: "sub-cancelled-111222333444",
          id: "schedule-start-006",
          service: "limio",
          created: "2021-11-01T08:00:00.000Z",
          reference: "START006PAY",
          mode: "production"
        }
      ]
    }
  ],
  loginStatus: "logged-in",
  loaded: true,
  token:
    "eyJraWQiOiJrdHFNMjE0WnlZRlhRVklEMGRCUTJ3Y1NRUThtMytJU1QwUHoyc0YyUGVZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkMTgzZTBlYy04YmFmLTQzMjAtYjg0Ny1jNzhmYWQwYjFkZjgiLCJldmVudF9pZCI6Ijc0MzgyNmY1LTA3NWMtNGMzNi04YmIyLWJmMzQzYmU0NmYwOSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2MTA2NDMxMDAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS1jZW50cmFsLTEuYW1hem9uYXdzLmNvbVwvZXUtY2VudHJhbC0xX0FWcnNiT3hTVSIsImV4cCI6MTYxMTg0ODg0MywiaWF0IjoxNjExODQ1MjQzLCJqdGkiOiIxNGZlMmVmMi1lYTM5LTQ3ZjItYmNlYS00YzkwOWJjMGQzNmMiLCJjbGllbnRfaWQiOiIza2RlMWc0cXVycWJkbWY3cDgxbjY1NjhtMCIsInVzZXJuYW1lIjoiZDE4M2UwZWMtOGJhZi00MzIwLWI4NDctYzc4ZmFkMGIxZGY4In0.coUsZ637mhna85v0uFtWVKOgG084xOlihyXABx5fmOcJBWXl9tJWgUDwH_7p5VYa_hCFf9mUzS-BPn7TgApBN99Hf6EXbTfWyD28yjynaNDhLu_yBie6g_FxVI_ovhsz-vdKZ8kaW5pUvbqQxnfhK-UmdMhCs4-CGldpNvYTWQqQT7epyI0luMtWht3BLhlyAndHhcCmoO59dLCCejvODl7tmBas2C1Po-UOU-MqQ3S4M5WQ_FEwAWdBK9laTfVqF2wOkMGqapDfAPFGrH0lDDld5USTJCeZOTqkx7RE6pk2xONVNNxwVTiNJN0C2CKbWv97UL2HG1h41PrC9UQ6ec"
};
