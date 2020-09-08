<template>
  <div>
    <h1>チャット</h1>
    <div class="private-notes-area">
      <div v-for="(message, id) in messages" v-bind:key="id">
        <p>{{ message.content }}</p>
      </div>
    </div>
    <div id="chat-form">
      <textarea
        v-model="content"
        name="content"
        class="form"
        placeholder="Content"
      ></textarea
      ><br />
      <button class="submit" v-on:click="createMessage()">投稿</button>
    </div>
    <amplify-sign-out></amplify-sign-out>
  </div>
</template>
<script>
import { API, Auth, graphqlOperation } from "aws-amplify";
import { createMessage } from "../graphql/mutations";
import { listMessages } from "../graphql/queries";
import { onCreateMessage } from "../graphql/subscriptions";
import _ from "lodash";

export default {
  name: "Chat",
  data() {
    return {
      content: "",
      message: null,
      messages: [],
      userName: "",
      limit: 100
    };
  },
  mounted: function() {
    this.setUserName().then(this.displayNewMessage());
  },
  methods: {
    setUserName: async function() {
      const user = await Auth.currentUserInfo();
      this.userName = user.username;
    },
    createMessage: async function() {
      if (this.content === "") return;
      const newMessage = {
        content: this.content,
        username: this.userName
      };
      try {
        this.content = "";
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
          userName: this.userName
        })
      ).subscribe({
        next: eventData => {
          const message = eventData.value.data.onCreateMessage;
          const messages = [...this.messages, message];
          this.messages = _.orderBy(
            messages,
            "updatedAt",
            "desc"
          );
        }
      });
    }
  }
};
</script>
