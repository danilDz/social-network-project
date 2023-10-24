export const getPosts = (req, res, next) => {
    res.status(200).json({
      posts: [
        { title: "First post", content: "This is the first post!" },
        { title: "Second post", content: "This is the second post!" },
        { title: "Third post", content: "This is the third post!" },
      ],
    });
  },
  postPost = (req, res, next) => {
    const title = req.body.title,
      content = req.body.content;
    // Create post in db
    res.status(201).json({
      message: "Post was created successfully!",
      post: {
        id: new Date().toISOString(),
        title,
        content,
      },
    });
  };
