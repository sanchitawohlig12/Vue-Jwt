<template>
  <v-container class="abcd">
    <v-form ref="form" @submit.prevent="handleSubmit" class="submitForm">
      <!-- Grouped Fields -->
      <v-row
        v-for="(group, index) in formGroups"
        :key="index"
        class="form-group"
      >
        <v-col cols="12" md="3" sm="12">
          <v-text-field
            label="Name"
            v-model="group.name"
            clearable
            :rules="[
              (v) => !!v || 'Name is required',
              (v) =>
                /^[a-zA-Z ]+$/.test(v) ||
                'Name must contain only alphabetic characters',
            ]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="12">
          <v-text-field
            label="Email"
            v-model="group.email"
            type="email"
            :rules="[
              (v) => !!v || 'Email is required',
              (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
            ]"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="12">
          <v-text-field
            label="Mobile Number"
            v-model="group.mobile"
            :rules="[
              (v) => !!v || 'Mobile Number is required',
              (v) =>
                /^[0-9]{10}$/.test(v.replace(/[^\d]/g, '')) ||
                'Invalid mobile number',
            ]"
            placeholder="(844) 448-0110"
            @input="onMobileInput($event, group)"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
    <div v-if="!ShowSecond || !ShowRemove">
          <v-btn color="primary" @click="addGroup" block>+ Add More</v-btn>
    </div>
       
        </v-col>
      
        <v-col cols="12" md="3" sm="12" v-if="ShowSecond && ShowRemove">
          <v-text-field
            label="Name"
            v-model="names"
            clearable
            :rules="[
             
              (v) =>
                /^[a-zA-Z ]+$/.test(v) ||
                'Name must contain only alphabetic characters',
            ]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="12" v-if="ShowSecond && ShowRemove">
          <v-text-field
            label="Email"
            v-model="emails"
            type="email"
            :rules="[
           
              (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
            ]"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" sm="12" v-if="ShowSecond && ShowRemove">
          <v-text-field
            label="Mobile Number"
            v-model="mobiles"
            :rules="[
              
              (v) =>
                /^[0-9]{10}$/.test(v.replace(/[^\d]/g, '')) ||
                'Invalid mobile number',
            ]"
            placeholder="(844) 448-0110"
            @input="onMobileInputForMobiles($event)"
            clearable
          ></v-text-field>
        </v-col>
      
        <v-col cols="12" md="3" >
          <div v-if="ShowSecond && ShowRemove">
          <v-btn color="red" @click="removeGroup()" block
            >Remove</v-btn

          >
          </div>
        </v-col>
      </v-row>

      <v-row class="form-group">
        <v-col cols="12" md="6" sm="12">
          <v-menu v-model="dateMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field
                v-model="birthDate"
                label="Birth Date"
                readonly
                v-bind="props"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="formData.endDate"
              color="primary"
              show-adjacent-months
              @update:model-value="dateMenu = false"
              :max="new Date()"
            ></v-date-picker>
          </v-menu>
        </v-col>

        <v-col cols="12" md="6" sm="12">
          <v-select
            v-model="city"
            :items="availableCities"
            label="City"
            multiple
            clearable
           
            :rules="[(v) => !!city.length || 'At least one city is required']"
          ></v-select>
        </v-col>
      </v-row>
      <v-row class="form-group">
        <v-col cols="12" md="6" sm="12" class="radioLabel">
          <span class="pt-2 font-weight-bold">Gender : </span>
          <v-radio-group
            v-model="gender"
            inline
            :rules="[(v) => !!gender || 'Gender is required']"
          >
            <v-radio label="Male" value="Male" class="ml-4"></v-radio>
            <v-radio label="Female" value="Female" class="ml-4"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <div class="checkboxes-container">
            <span class="pt-4 font-weight-bold">Languages : </span>

            <v-checkbox
              v-for="language in languagesAll"
              :key="language"
              :label="language"
              :value="language"
              v-model="languages"
            ></v-checkbox>
          </div>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-file-input
        
          v-model="file"
            label="File Upload"
            @change="handleFileUpload($event)"
            accept=".jpeg, .pdf"
            clearable
            :rules="[(v) => !!file || 'File is required']"
          ></v-file-input>
        </v-col>
      </v-row>

      <v-row class="d-flex justify-center">
        <v-col cols="12" md="4">
          <v-btn type="submit" color="success" block>Submit</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <!-- Display Submitted Data -->
    <div v-if="submittedData.length">
      <h2 class="mt-6">Submitted Data</h2>
      <v-data-table
        :headers="headers"
        :items="submittedData"
        class="elevation-1"
      >
        <template v-slot:languages="{ item }">
          <td>{{ item.languages.join(", ") }}</td>
        </template>
        <template v-slot:city="{ item }">
          <td>{{ item.city.join(", ") }}</td>
        </template>
        <template v-slot:file="{ item }">
          <td>{{ item.file ? item.file.name : "No file uploaded" }}</td>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script>
import axios from "axios";
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      formGroups: [
        {
          name: "",
          email: "",
          mobile: "",
        },
      ],
      menu: false,
      names: "",
          emails: "",
          mobiles: "",
      gender: "Female",
      city: [],
      file: null,
      submittedData: [],
      languagesAll: ["Angular", "Vue.js", "React.js"],
      languages: [],
      ShowSecond:false,
      ShowRemove:false,
      cities: [
        "Mumbai",
        "Delhi",
        "Kolkata",
        "Chennai",
        "Bangalore",
        "Hyderabad",
        "Ahmedabad",
        "Pune",
        "Surat",
        "Indore",
      ],
      // headers: [
      //   { title: "Name", value: "name" },
      //   { title: "Email", value: "email" },
      //   { title: "Mobile", value: "mobile" },
      //   { title: "Birth Date", value: "birthDate" },
      //   { title: "Gender", value: "gender" },
      //   { title: "Languages", value: "languages" },
      //   { title: "City", value: "city" },
      //   { title: "File", value: "file" },
      //   ...(this.ShowSecond === true
      //     ? [
      //         { title: "New Header 1", value: "names" },
      //         { title: "New Header 2", value: "emails" },
      //         { title: "New Header 3", value: "mobiles" },
      //       ]
      //     : []),
      // ],
      formData: {
        endDate: new Date(),
      },
      dateMenu: false,
    };
  },
  computed: {
    
    birthDate() {
      return this.formData.endDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
    headers() {
      let headers = [
        { title: 'Name', value: 'name' },
        { title: 'Email', value: 'email' },
        { title: 'Mobile', value: 'mobile' },
        { title: 'Birth Date', value: 'birthDate' },
        { title: 'Gender', value: 'gender' },
        { title: 'Languages', value: 'languages' },
        { title: 'City', value: 'city' },
        { title: 'File', value: 'file' },
      ];

      if (this.ShowSecond) {
        headers = headers.concat([
          { title: 'Names', value: 'names' },
          { title: 'Emails', value: 'emails' },
          { title: 'Mobiles', value: 'mobiles' },
        ]);
      }

      return headers;
    },
    availableCities() {
      return this.cities.filter(city => !this.city.includes(city));
    },
  },
  methods: {
    formatMobileNumber(value) {
    const cleaned = ('' + value).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  },
  onMobileInput(event, group) {
    const formattedValue = this.formatMobileNumber(event.target.value);
    group.mobile = formattedValue;
  },
  onMobileInputForMobiles(event) {
    const formattedValue = this.formatMobileNumber(event.target.value);
    this.mobiles = formattedValue;
  },
    addGroup() {
      this.ShowSecond = true
      this.ShowRemove = true
      
    },
    removeGroup() {
      this.ShowSecond = false
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (
        file &&
        (file.type === "application/pdf" || file.type === "image/jpeg")
      ) {
        this.file = file;
      } else {
        alert("Only JPEG and PDF files are allowed");
      }
    },
    resetFields() {
      this.formGroups = [
        {
          name: "",
          email: "",
          mobile: "",
        },
      ];
      this.gender = "Female";
      this.names="";
      this.emails ="";
      this.mobiles ="";
      this.city = [];
      this.file = null;
      this.languages = [];
      this.formData.endDate = new Date();
      this.dateMenu = false;
      
      this.$nextTick(() => {
        this.$refs.form.resetValidation();
      });
    },

    async handleSubmit() {
      const apiEndpoint = "http://localhost:4000/api/submit";
      const toast = useToast();
      const token = localStorage.getItem("jwtToken");

      try {
        // Check if there are validation errors in any of the form fields
        const { valid } = await this.$refs.form.validate();

        if (valid) {
          const responses = [];
          for (const formData of this.formGroups) {
            const postData = {
              ...formData,
              birthDate: this.birthDate,
              gender: this.gender,
              names: this.names,
              emails: this.emails,
          mobiles: this.mobiles,
              languages: this.languages,
              city: this.city,
              file: this.file.name,

            };
            const response = await axios.post(apiEndpoint, postData, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            });
            responses.push(response.data.formData);
          }
          this.submittedData = this.submittedData.concat(responses);
          toast.success("Form submitted successfully");
        this.ShowRemove = false
          this.resetFields();

        } else {
          toast.error("Please fill in all required fields correctly");
        }
      } catch (error) {
        toast.error("Please fill in all required fields correctly");
      }
    },
  },
  beforeCreate() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      this.$router.push({ name: "Login" });
    }
  },
};
</script>
<style>
.abcd {
  height: 100%;
}
.form-group {
  margin-bottom: 20px;
}
.checkboxes-container {
  display: flex;

  flex-wrap: wrap;
}
.submitForm {
  padding: 5%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
.radioLabel {
  display: flex;
  justify-content: center;
}
</style>