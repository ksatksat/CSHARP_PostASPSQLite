using Microsoft.AspNetCore.Mvc;

namespace SimplePostApp.Controllers;

public class HomeController : Controller
{
    public IActionResult Index() => View();
}
