export const getPosts = (req, res, next) => {
    res.status(200).json({
      posts: [
        {
          _id: 1,
          title: "First post",
          content: "This is the first post!",
          imageURL: "images/photo.jpeg",
          createdAt: new Date(),
          creator: {
            name: "Daniil",
          },
        },
      ],
    });
  },
  postPost = (req, res, next) => {
    const title = req.body.title,
      content = req.body.content,
      name = 'name';
    // Create post in db
    res.status(201).json({
      message: "Post was created successfully!",
      post: {
        _id: new Date().toISOString(),
        title,
        content,
        creator: {
          name
        },
        createdAt: new Date()
      },
    });
  };
