// Altered example from Limio docs: https://developers.limio.com/limio-sdk/user
export const docUser = {
  "username": "id-c49d0d60611eb155d2cdcb0bbfab0af8",
  attributes: {
    aud: "3kde1g4qurqbdmf7p81n6568m0",
    auth_time: 1610643100,
    "cognito:username": "dummy_user",
    email: "dummy@limio.com",
    email_verified: true,
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
      data: {},
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
          name: "Limio Monthly",
          quantity: 1,
          price: {
            summary: {
              headline: "£20/month"
            },
            currency: "GBP",
            amount: 1
          },
          products: [],
          termEndDate: "2022-09-02T10:25:01.000Z",
          attributes: {
            autoRenew__limio: true
          }
        }
      ],
      schedule: [
        {
          data: {
            date: "2022-06-09T12:44:38.771Z",
            reference: "a85cbcf1-fcbc-4320-be3f-eaacaaff578f_charge0",
            description: "Limio Monthly",
            amount: "20.00",
            currency: "GBP",
            type: "payment"
          },
          status: "pending",
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
            reference: "a85cbcf1-fcbc-4320-be3f-eaacaaff578f_charge0",
            description: "Limio Monthly",
            amount: "20.00",
            currency: "GBP",
            type: "payment"
          },
          status: "pending",
          record_type: "schedule",
          related: "sub-34cb9ce9a3777a164bb1ad471f20a83b",
          owner: "id-hfmd3qJIYU8XZZo-5JI2UOkdacXd0JXBYlptgRGcLMM",
          id: "schedule-f0899162c4c161a0f8c2535dd1526334",
          service: "limio",
          created: "2022-06-09T12:44:38.771Z",
          reference: "7GH68M5H61C0",
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
