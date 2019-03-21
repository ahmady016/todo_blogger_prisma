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

const getUserByEmailOrId = async (args, context) => {
  let user = await context.prisma.user({ id: args.emailOrId });
  if(!user)
    user = await context.prisma.user({ email: args.emailOrId });
  return user;
}

const getUserWith = async (args, context, children) => {
  let user = await context.prisma.user({ id: args.emailOrId })[children]();
  if(!user)
    user = await context.prisma.user({ email: args.emailOrId })[children]();
  return user;
}

const Query = {
  users: (root, args, context) => context.prisma.users(),
  user: (root, args, context) => getUserByEmailOrId(args, context),
  posts: (root, args, context) => context.prisma.posts(),
  userPosts: (root, args, context) => getUserWith(args, context, 'posts'),
  post: (root, args, context) => context.prisma.post({ id: args.id }),
  comments: (root, args, context) => context.prisma.comments(),
  postComments: (root, args, context) => context.prisma.post({ id: args.id }).comments(),
  comment: (root, args, context) => context.prisma.comment({ id: args.id }),
  albums: (root, args, context) => context.prisma.albums(),
  userAlbums: (root, args, context) => getUserWith(args, context, 'albums'),
  album: (root, args, context) => context.prisma.album({ id: args.id }),
  photos: (root, args, context) => context.prisma.photos(),
  albumPhotos: (root, args, context) => context.prisma.album({ id: args.id }).photos(),
  photo: (root, args, context) => context.prisma.photo({ id: args.id }),
  todos: (root, args, context) => context.prisma.todoes(),
  userTodos: (root, args, context) => getUserWith(args, context, 'todos'),
  todo: (root, args, context) => context.prisma.todo({ id: args.id }),
};

const Mutation = {
  addNewUser: (root, args, context) => context.prisma.createUser(convert(args.data)),
  updateUser: (root, args, context) => context.prisma.updateUser({ where: { id: args.id }, data: convert(args.data) }),
  deleteUser: (root, args, context) => context.prisma.deleteUser({ id: args.id }),
  addNewPost: (root, args, context) => context.prisma.createPost(connect(convert(args.data), 'author')),
  updatePost: (root, args, context) => context.prisma.updatePost({ where: { id: args.id }, data: convert(args.data) }),
  deletePost: (root, args, context) => context.prisma.deletePost({ id: args.id }),
  addNewComment: (root, args, context) => context.prisma.createComment(connect(convert(args.data), 'post,author')),
  updateComment: (root, args, context) => context.prisma.updateComment({ where: { id: args.id }, data: convert(args.data) }),
  deleteComment: (root, args, context) => context.prisma.deleteComment({ id: args.id }),
  addNewAlbum: (root, args, context) => context.prisma.createAlbum(connect(convert(args.data), 'author')),
  updateAlbum: (root, args, context) => context.prisma.updateAlbum({ where: { id: args.id }, data: convert(args.data) }),
  deleteAlbum: (root, args, context) => context.prisma.deleteAlbum({ id: args.id }),
  addNewPhoto: (root, args, context) => context.prisma.createPhoto(connect(convert(args.data), 'album')),
  updatePhoto: (root, args, context) => context.prisma.updatePhoto({ where: { id: args.id }, data: convert(args.data) }),
  deletePhoto: (root, args, context) => context.prisma.deletePhoto({ id: args.id }),
  addNewTodo: (root, args, context) => context.prisma.createTodo(connect(convert(args.data), 'author')),
  updateTodo: (root, args, context) => context.prisma.updateTodo({ where: { id: args.id }, data: convert(args.data) }),
  deleteTodo: (root, args, context) => context.prisma.deleteTodo({ id: args.id }),
};

const Address = {
  geo: (root, args, context) => context.prisma.address({ id: root.id }).geo(),
}
const User = {
  address: (root, args, context) => context.prisma.user({ id: root.id }).address(),
  company: (root, args, context) => context.prisma.user({ id: root.id }).company(),
  posts: (root, args, context) => context.prisma.user({ id: root.id }).posts(),
  albums: (root, args, context) => context.prisma.user({ id: root.id }).albums(),
  todos: (root, args, context) => context.prisma.user({ id: root.id }).todos()
};
const Post = {
  author: (root, args, context) => context.prisma.post({ id: root.id }).author(),
  comments: (root, args, context) => context.prisma.post({ id: root.id }).comments(),
};
const Comment = {
  post: (root, args, context) => context.prisma.comment({ id: root.id }).post(),
  author: (root, args, context) => context.prisma.comment({ id: root.id }).author(),
};
const Album = {
  author: (root, args, context) => context.prisma.album({ id: root.id }).author(),
  photos: (root, args, context) => context.prisma.album({ id: root.id }).photos(),
};
const Photo = {
  album: (root, args, context) => context.prisma.photo({ id: root.id }).album(),
};
const Todo = {
  author: (root, args, context) => context.prisma.todo({ id: root.id }).author(),
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