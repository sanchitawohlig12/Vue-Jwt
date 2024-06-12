<template>
  <v-container class="abc">
    <v-form @submit.prevent="handleLogin" class="loginForm">
      <v-row>
        <v-col cols="12" class="text-center">
          <h2 class="header">Login Page</h2>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Username"
            v-model="loginData.username"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            label="Password"
            v-model="loginData.password"
            :append-inner-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show2 ? 'text' : 'password'"
            class="input-group--focused"
            name="input-10-2"
            @click:append-inner="show2 = !show2"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" align="center">
          <v-btn color="primary" type="submit" block>Login</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      loginData: {
        username: "",
        password: "",
      },
      show1: false,
      show2: true,
    };
  },
  methods: {
    async handleLogin() {
      const apiEndpoint = "http://localhost:4000/api/login";
      const toast = useToast();
      try {
        const response = await axios.post(apiEndpoint, this.loginData);
        const token = response.data.token;
        localStorage.setItem("jwtToken", token);
        this.$router.push({ name: "FormComponent" });
        toast.success("Login successful");
      } catch (error) {
        console.error("Error logging in:", error);
        toast.error("Login failed");
      }
    },
  },
};
</script>
<style>
.abc {
  width: 600px !important;
  max-width: 600px !important;
  min-width: 600px !important;
  height: 100%;
}
.loginForm {
  padding: 20%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); /* Add shadow effect */
}
.header {
  margin-bottom: 50px;
}
</style>
