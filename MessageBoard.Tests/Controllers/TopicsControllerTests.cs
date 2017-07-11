using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using MessageBoard.Controllers;
using MessageBoard.Tests.Fakes;
using MessageBoard.Data;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using System.Net.Http;
using System.Web.Http.Routing;
using System.Web.Http.Controllers;
using System.Web.Http.Hosting;
using Newtonsoft.Json;

namespace MessageBoard.Tests.Controllers
{
    [TestClass]
    public class TopicsControllerTests
    {
        private TopicsController _ctrl;

        [TestInitialize]
        public void Init()
        {
            _ctrl = new TopicsController(new FakeMessageBoardRepository());
        }

        [TestMethod]
        public void TopicsCtrl_Get()
        {

            var results = _ctrl.Get(true);

            Assert.IsNotNull(results);
            List<Topic> topics = new List<Topic>();

            foreach(var i in results)
            {
                topics.Add(i);
            }
            Assert.IsTrue(topics.Count > 0);
            Assert.IsNotNull(topics[0]);
            Assert.IsNotNull(topics[0].Title);
            
        }

        [TestMethod]
        public void TopicsController_Post()
        {

            var config = new HttpConfiguration();
            var request = new HttpRequestMessage(HttpMethod.Post, "http://localhost/api/v1/topics");
            var route = config.Routes.MapHttpRoute("DefaultApi", "api/{controller}/{id}");
            var routeData = new HttpRouteData(route, new HttpRouteValueDictionary { { "controller", "topics" } });

            _ctrl.ControllerContext = new HttpControllerContext(config, routeData, request);
            _ctrl.Request = request;
            _ctrl.Request.Properties[HttpPropertyKeys.HttpConfigurationKey] = config;

            var newTopic = new Topic()
            {
                Title = "Test title",
                Body = "Test title body"
            };

            var result = _ctrl.Post(newTopic);

            Assert.AreEqual(HttpStatusCode.Created, result.StatusCode);

            var json = result.Content.ReadAsStringAsync().Result;
            var topic = JsonConvert.DeserializeObject<Topic>(json);
            Assert.IsNotNull(topic);
            Assert.IsTrue(topic.Id > 0);

            Assert.IsTrue(topic.Created > DateTime.MinValue);

        }
    }
}
