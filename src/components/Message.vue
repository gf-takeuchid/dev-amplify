<template>
  <div>
    <section>
      <div class="container is-fluid">
        <h1 class="title">
          投稿画面
        </h1>
      </div>
    </section>
    <section class="section columns is-centered">
      <div class="column is-half">
        <div v-for="(message, id) in messages" v-bind:key="id">
          <div class="box mb-3">
            <article class="media">
              <div class="media-left">
                <amplify-s3-image :img-key="message.image" level="protected" />
              </div>
              <div class="media-content">
                <div class="content">
                  <strong>{{ message.title }}</strong
                  ><br />
                  {{ message.description }}
                  <div class="has-text-right is-size-7">
                    {{ message.name }}
                    <small>{{ message.updatedAt }}</small>
                  </div>
                </div>
              </div>
              <div class="media-right">
                <button
                  class="delete"
                  @click="deleteMessage(message.id, message.title)"
                ></button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
    <section class="columns is-centered">
      <div class="mb-6 column is-two-thirds">
        <div class="columns">
          <div class="column">
            <b-field>
              <b-upload
                drag-drop
                :value="image"
                class="file-label"
                @input="uploadFile"
              >
                <section class="section">
                  <div class="content has-text-centered">
                    <p>
                      <b-icon icon="upload" size="is-large"> </b-icon>
                    </p>
                    <p>Drop your files here or click to upload</p>
                  </div>
                </section>
              </b-upload>
            </b-field>
            <div class="tags">
              <span class="tag is-primary" v-if="imageName">
                {{ imageName }}
              </span>
            </div>
          </div>
          <div class="column">
            <b-field grouped label-position="on-border" label="タイトル">
              <b-input v-model="title" name="title" expanded></b-input>
            </b-field>
            <b-field grouped label-position="on-border" label="本文">
              <b-input
                v-model="description"
                name="description"
                maxlength="500"
                type="textarea"
                rows="10"
                expanded
              ></b-input>
            </b-field>
          </div>
        </div>
        <button
          class="button is-info is-light is-medium is-fullwidth"
          v-on:click="createMessage()"
        >
          投稿
        </button>
      </div>
    </section>
  </div>
</template>
<script>
import { API, Auth, graphqlOperation, Storage } from "aws-amplify";
import { createMessage, deleteMessage } from "@/graphql/mutations";
import { listMessages } from "@/graphql/queries";
import { onCreateMessage, onDeleteMessage } from "@/graphql/subscriptions";
import _ from "lodash";

export default {
  name: "Message",
  data() {
    return {
      title: "",
      description: "",
      image: null,
      imageName: "",
      userName: "",
      limit: 10,
      messages: [],
      subscribe: {}
    };
  },
  mounted() {
    this.setUserName().then(this.reloadMessage());
    this.subscribe = API.graphql(graphqlOperation(onCreateMessage)).subscribe({
      next: () => this.reloadMessage()
    });

    this.subscribe = API.graphql(graphqlOperation(onDeleteMessage)).subscribe({
      next: () => this.reloadMessage()
    });
  },
  beforeDestroy() {
    this.subscribe.unsubscribe();
  },
  methods: {
    uploadFile(file) {
      if (file === undefined) {
        this.$buefy.dialog.alert({
          message: "画像が認識できませんでした。",
          type: "is-info"
        });
        return;
      }
      this.imageName = file.name;
      Storage.put(file.name, file, { level: "protected" })
        .then(result => {
          console.log(result);
        })
        .catch(err => console.log(err));
    },
    async setUserName() {
      this.userName = (await Auth.currentUserInfo()).attributes.nickname;
    },
    deleteMessage(id, title) {
      this.$buefy.dialog.confirm({
        message: "記事を完全に削除しますか？",
        type: "is-info",
        onConfirm: async () => {
          await API.graphql(graphqlOperation(deleteMessage, { input: { id } }));
          this.$buefy.snackbar.open(`「${title}」の記事を削除しました`);
        }
      });
    },
    async createMessage() {
      if (this.title === "") {
        this.$buefy.dialog.alert({
          message: "タイトルは入力必須です。",
          type: "is-info"
        });
        return;
      }
      const newMessage = {
        name: this.userName,
        description: this.description,
        title: this.title,
        image: this.imageName
      };
      try {
        this.title = "";
        this.description = "";
        this.image = null;
        this.imageName = "";
        await API.graphql(
          graphqlOperation(createMessage, { input: newMessage })
        );
        this.$buefy.snackbar.open(
          `「${newMessage.title}」の記事を投稿しました`
        );
      } catch (error) {
        console.log(error);
      }
    },
    async reloadMessage() {
      let messages = await API.graphql(
        graphqlOperation(listMessages, { limit: this.limit })
      );
      this.messages = _.orderBy(
        messages.data.listMessages.items,
        "updatedAt",
        "asc"
      );
    }
  }
};
</script>

<style>
amplify-s3-image {
  --height: 100px;
  --width: 100px;
}
</style>
