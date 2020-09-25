<template>
  <div>
    <amplify-authenticator username-alias="email">
      <amplify-sign-up
          slot="sign-up"
          username-alias="email"
          :form-fields.prop="formFields"
      ></amplify-sign-up>
    </amplify-authenticator>
  </div>
</template>

<script>
export default {
  name: "SignIn",
  data() {
    return {
      formFields: [
        { type: "nickname", label: "ニックネーム" },
        { type: "password" },
        { type: "email" }
      ]
    };
  }
};
</script>

<style>
amplify-authenticator {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100vh;
}
</style>
