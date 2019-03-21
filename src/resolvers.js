const convert = (obj) => {
  return Object.keys(obj).reduce( (res, key) => {
    // is array of objects
    if(Array.isArray(obj[key]) && ( typeof obj[key][0] === "object" && !Array.isArray(obj[key][0])) )
      res[key] = { create: obj[key].map(convert) };
    // is object and not array
    else if( typeof obj[key] === "object" && !Array.isArray(obj[key]) )
      res[key] = { create: convert(obj[key]) };
    // is any other type [string, date, number]
    else
      res[key] = obj[key];
    return res;
  }, {});
}

const connect = (obj, key) => {
  let foreignKey = '';
  if(key.includes(',')) {
    key.split(',').forEach( key => {
      foreignKey = `${key}Id`;
      if(obj[foreignKey]) {
        obj[key] = { connect: { id: obj[foreignKey] } };
        delete obj[foreignKey];
      }
    })
    return obj;
  }
  foreignKey = `${key}Id`;
  if(obj[foreignKey]) {
    obj[key] = { connect: { id: obj[foreignKey] } };
    delete obj[foreignKey];
  }
  return obj;
};

let list;
const getUserByEmailOrId = async (emailOrId, db, info) => {
  list = await db.query.users({ where: { OR: [{ id: emailOrId }, { email: emailOrId }] } }, info);
  return list[0];
}
const getUserWith = async (emailOrId, db, children, info) => {
  list = await db.query.users({ where: { OR: [{ id: emailOrId }, { email: emailOrId }] } }, info);
  return list[children];
}
const getAlbumPhotos = async (id, db, info) => {
  list = await db.query.album({ where: { id } }, info);
  return list.photos;
}

const Query = {
  users: (_, args, { db }, info) => db.query.users({}, info),
  user: (_, { emailOrId }, { db }, info) => getUserByEmailOrId(emailOrId, db, info),
  posts: (_, args, { db }, info) => db.query.posts({}, info),
  userPosts: (_, { emailOrId }, { db }, info) => getUserWith(emailOrId, db, 'posts', info),
  post: (_, { id }, { db }, info) => db.query.post({ where: { id } }),
  comments: (_, args, { db }, info) => db.query.comments({}, info),
  postComments: (_, args, { db }, info) => db.query.post({ id: args.id }).comments(),
  comment: (_, { id }, { db }, info) => db.query.comment({ where: { id } }),
  albums: (_, args, { db }, info) => db.query.albums({}, info),
  userAlbums: (_, { emailOrId }, { db }, info) => getUserWith(emailOrId, db, 'albums', info),
  album: (_, { id }, { db }, info) => db.query.album({ where: { id } }),
  photos: (_, args, { db }, info) => db.query.photos({}, info),
  albumPhotos: (_, { id }, { db }, info) => getAlbumPhotos(id, db, info),
  photo: (_, { id }, { db }, info) => db.query.photo({ where: { id } }),
  todos: (_, args, { db }, info) => db.query.todoes({}, info),
  userTodos: (_, { emailOrId }, { db }, info) => getUserWith(emailOrId, db, 'todoes', info),
  todo: (_, { id }, { db }, info) => db.query.todo({ where: { id } }),
};

const Mutation = {
  addNewUser: (_, { data }, { db }, info) => db.mutation.createUser({ data: convert(data) }, info),
  updateUser: (_, { id, data }, { db }, info) => db.mutation.updateUser({ where: { id }, data: convert(data) }, info),
  deleteUser: (_, { id }, { db }, info) => db.mutation.deleteUser({ where: { id } }, info),
  addNewPost: (_, { data }, { db }, info) => db.mutation.createPost({ data: connect(convert(data), 'author') }, info),
  updatePost: (_, { id, data }, { db }, info) => db.mutation.updatePost({ where: { id } },{ data: convert(data) }, info),
  deletePost: (_, { id }, { db }, info) => db.mutation.deletePost({ where: { id } }, info),
  addNewComment: (_, { data }, { db }, info) => db.mutation.createComment({ data: connect(convert(data), 'post,author') }, info),
  updateComment: (_, {id, data}, { db }, info) => db.mutation.updateComment({ where: { id }, data: convert(data) }, info),
  deleteComment: (_, { id }, { db }, info) => db.mutation.deleteComment({ where: { id } }, info),
  addNewAlbum: (_, { data }, { db }, info) => db.mutation.createAlbum({ data: connect(convert(data), 'author') }, info),
  updateAlbum: (_, { id, data }, { db }, info) => db.mutation.updateAlbum({ where: { id }, data: convert(data) }, info),
  deleteAlbum: (_, { id }, { db }, info) => db.mutation.deleteAlbum({ where: { id } }, info),
  addNewPhoto: (_, { data }, { db }, info) => db.mutation.createPhoto({ data: connect(convert(data), 'album') }, info),
  updatePhoto: (_, { id, data }, { db }, info) => db.mutation.updatePhoto({ where: { id }, data: convert(data) }, info),
  deletePhoto: (_, { id }, { db }, info) => db.mutation.deletePhoto({ where: { id } }, info),
  addNewTodo: (_, { data }, { db }, info) => db.mutation.createTodo({ data: connect(convert(data), 'author') }, info),
  updateTodo: (_, { id, data }, { db }, info) => db.mutation.updateTodo({ where: { id }, data: convert(data) }, info),
  deleteTodo: (_, { id }, { db }, info) => db.mutation.deleteTodo({ where: { id } }, info),
};

const Address = {

}
const User = {

};
const Post = {

};
const Comment = {

};
const Album = {

};
const Photo = {

};
const Todo = {

};

export default {
  Query,
  Mutation,
  Address,
  User,
  Post,
  Comment,
  Album,
  Photo,
  Todo
}