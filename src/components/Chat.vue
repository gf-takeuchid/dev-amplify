<template>
  <div>
    <h1>チャット</h1>
    <div class="private-notes-area">
      <div v-for="(message, id) in messages" v-bind:key="id">
        <p>title:{{ message.title }}</p>
        <p>name:{{ message.name }}</p>
        <p>description:{{ message.description }}</p>
      </div>
    </div>
    <div id="chat-form">
      <textarea
        v-model="title"
        name="title"
        class="form"
        placeholder="title"
      ></textarea
      ><br />
      <textarea
        v-model="description"
        name="description"
        class="form"
        placeholder="description"
      ></textarea
      ><br />
      <button class="submit" v-on:click="createMessage()">投稿</button>
    </div>
    <div>
      <amplify-sign-out button-text="ログアウト"></amplify-sign-out>
    </div>
  </div>
</template>
<script>
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createMessage } from "@/graphql/mutations";
import { listMessages } from "@/graphql/queries";
import { onCreateMessage } from "@/graphql/subscriptions";
import _ from "lodash";

export default {
  name: "Chat",
  data() {
    return {
      title: "",
      description: "",
      name: "",
      limit: 10,
      message: null,
      messages: []
    };
  },
  mounted: function() {
    this.setUserName().then(this.displayNewMessage());
  },
  methods: {
    setUserName: async function() {
      this.name = (await Auth.currentUserInfo()).attributes.nickname;
    },
    createMessage: async function() {
      if (this.title === "") return;
      const newMessage = {
        name: this.name,
        description: this.description,
        title: this.title
      };
      try {
        this.title = "";
        this.description = "";
        await API.graphql(
          graphqlOperation(createMessage, { input: newMessage })
        );
      } catch (error) {
        error;
      }
    },
    displayNewMessage: async function() {
      let messages = await API.graphql(
        graphqlOperation(listMessages, { limit: this.limit })
      );
      this.messages = _.orderBy(
        messages.data.listMessages.items,
        "updatedAt",
        "desc"
      );

      API.graphql(
        graphqlOperation(onCreateMessage, {
          limit: this.limit,
          name: this.name
        })
      ).subscribe({
        next: eventData => {
          const message = eventData.value.data.onCreateMessage;
          const messages = [...this.messages, message];
          this.messages = _.orderBy(messages, "updatedAt", "desc");
        }
      });
    }
  }
};
</script>
