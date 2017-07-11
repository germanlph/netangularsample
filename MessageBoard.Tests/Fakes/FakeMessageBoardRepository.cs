using MessageBoard.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MessageBoard.Tests.Fakes
{
    class FakeMessageBoardRepository : IMessageBoardRepository
    {
        public bool AddReply(Reply newReply)
        {
            throw new NotImplementedException();
        }

        public bool AddTopic(Topic newTopic)
        {
            //todo more?
            newTopic.Id = 1;
            return true;
        }

        public IQueryable<Reply> GetRepliesByTopic(int topicId)
        {
            throw new NotImplementedException();
        }

        public IQueryable<Topic> GetTopics()
        {
            return new Topic[]
            {
                new Topic()
                {
                    Id = 1,
                    Title = "This is a fake title",
                    Body = "this is a fake body",
                    Created = DateTime.UtcNow
                },
                new Topic()
                {
                    Id = 2,
                    Title = "This is topic 2 title",
                    Body = "This is topic 2 body",
                    Created = DateTime.UtcNow
                }
            }.AsQueryable();
        }

        public IQueryable<Topic> GetTopicsIncludingReplies()
        {
            return new Topic[]
          {
                new Topic()
                {
                    Id = 1,
                    Title = "This is a fake title",
                    Body = "this is a fake body",
                    Created = DateTime.UtcNow,
                    Replies = new Reply[]
                    {
                        new Reply()
                        {
                            Id = 1,
                            Body = "Reply body",
                            Created = DateTime.UtcNow,
                            TopicId = 1
                        },
                        new Reply()
                        {
                            Id = 2,
                            Body = "Reply body",
                            Created = DateTime.UtcNow,
                            TopicId = 1
                        }
                    }
                },
                new Topic()
                {
                    Id = 2,
                    Title = "This is topic 2 title",
                    Body = "This is topic 2 body",
                    Created = DateTime.UtcNow,
                    Replies = new Reply[]
                    {
                        new Reply()
                        {
                            Id = 1,
                            Body = "Reply body",
                            Created = DateTime.UtcNow,
                            TopicId = 2
                        },
                        new Reply()
                        {
                            Id = 2,
                            Body = "Reply body",
                            Created = DateTime.UtcNow,
                            TopicId = 2
                        }
                    }
                }
          }.AsQueryable();
        }

        public bool Save()
        {
            //todo more?
            return true;
        }
    }
}
