// Import the required libraries
// 必要なライブラリをインポート
var graphql = require("graphql");
var graphqlHTTP = require("express-graphql");
var express = require("express");

// Import the data you created above
// 作成したデータをインポート
var data = require("./data.json");

// 2つの文字列フィールド（`id`と`name`）を持ったUser型を定義
// Userの型は、自分の型（今回の場合はGraphQLString）を持つ子フィールドを持ったGraphQLObjectTypeとなる
var userType = new graphql.GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
  },
});

// ひとつのtop-levelのフィールド`user`を持ったスキーマを定義
// それは引数`id`を取り、そのIDを持ったUserを返す
// `query`はUserと同じようにGraphQLObjectTypeとなることに注意
// しかしながら`user`フィールドは、上で定義したuserTypeとなる
var schema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: "Query",
    fields: {
      user: {
        type: userType,
        // `args`は`user`クエリが許可する引数を記述
        args: {
          id: { type: graphql.GraphQLString },
        },
        // resolve関数は受け取ったクエリの解決方法、または実行方法を記述
        // 今回は、`data`からUserを取得するために、keyとして上記の引数`id`を使う
        resolve: function (_, args) {
          return data[args.id];
        },
      },
    },
  }),
});

express()
  .use("/graphql", graphqlHTTP({ schema: schema, pretty: true }))
  .listen(3000);

console.log("GraphQL server running on http://localhost:3000/graphql");
