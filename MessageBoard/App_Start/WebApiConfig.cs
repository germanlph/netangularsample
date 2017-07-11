using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace MessageBoard.App_Start
{
    public class WebApiConfig
    {
        public static void Register(HttpConfiguration configuration)
        {
            var jsonFormatter = configuration.Formatters.OfType<JsonMediaTypeFormatter>().First();
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            configuration.Routes.MapHttpRoute("RepliesRoute", 
                "api/v1/topics/{topicId}/replies/{id}", 
                new { controller = "replies", id = RouteParameter.Optional });

            configuration.Routes.MapHttpRoute("DefaultApi", 
                "api/v1/topics/{id}", 
                new { controller = "topics", id = RouteParameter.Optional });

            configuration.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
        }
    }
}