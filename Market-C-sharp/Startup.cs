using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


// моё пространство имён проекта (классы и тп)
namespace Market_C_sharp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // функция для регистрации плагинов/модулей
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages();
            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseDeveloperExceptionPage(); // показывать ошибки
            app.UseStatusCodePages(); // коды response
            app.UseStaticFiles(); // css, картинки, статика
            app.UseMvcWithDefaultRoute(); // отслеживание URL и работа с контроллерами
        }
    }
}
