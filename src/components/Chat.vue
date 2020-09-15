<template>
  <div>
    <section class="section">
      <div class="container">
        <h1 class="title">
          チャット
        </h1>
      </div>
    </section>
    <section class="columns">
      <div class="column is-half is-offset-one-quarter">
        <div v-for="(message, id) in messages" v-bind:key="id">
          <b-message
            :title="message.title"
            type="is-info"
            has-icon
            aria-close-label="Close message"
          >
            {{ message.description }}
            <div>{{ message.name }}({{ message.updatedAt }})</div>
          </b-message>
        </div>
      </div>
    </section>
    <section class="columns">
      <div class="column is-4 is-offset-one-quarter">
        <b-field label-position="on-border" label="タイトル">
          <b-input v-model="title" name="title" expanded></b-input>
        </b-field>
        <b-field label-position="on-border" label="本文">
          <b-input v-model="description" name="description" maxlength="200" type="textarea" expanded></b-input>
        </b-field>
        <b-field>
          <p class="control">
            <button class="button is-info" v-on:click="createMessage()">投稿</button>
          </p>
        </b-field>
      </div>
    </section>
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
      messages: [],
      subscribe: {}
    };
  },
  mounted: function() {
    this.setUserName().then(this.displayNewMessage());
  },
  beforeDestroy() {
    this.subscribe.unsubscribe();
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
        "asc"
      );

      this.subscribe = API.graphql(
        graphqlOperation(onCreateMessage, {
          limit: this.limit,
          name: this.name
        })
      ).subscribe({
        next: eventData => {
          const message = eventData.value.data.onCreateMessage;
          const messages = [...this.messages, message];
          this.messages = _.orderBy(messages, "updatedAt", "asc");
        }
      });
    }
  }
};
</script>
