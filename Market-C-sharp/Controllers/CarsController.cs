using Market_C_sharp.Data.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Market_C_sharp.Controllers
{
    public class CarsController : Controller
    {

        private readonly IAllcars _allCars;
        private readonly ICarsCategory _allCategories;

        public CarsController(IAllcars iAllCars, ICarsCategory iCarsCat)
        {
            _allCars = iAllCars;
            _allCategories = iCarsCat;
        }

        public ViewResult List()
        {
            return View();
        }
    }
}
