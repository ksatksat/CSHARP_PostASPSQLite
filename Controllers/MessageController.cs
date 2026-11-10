using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimplePostApp.Data;
using SimplePostApp.Models;

namespace SimplePostApp.Controllers;

public record MessageDto(string? Text);

public class MessageController : Controller
{
    private const int MaxLength = 200;
    private readonly AppDbContext _db;

    public MessageController(AppDbContext db) => _db = db;

    // HTTP POST /message  -> saves a new message in SQLite
    [HttpPost("/message")]
    public async Task<IActionResult> Create([FromBody] MessageDto? dto)
    {
        var text = dto?.Text?.Trim();

        if (string.IsNullOrEmpty(text))
            return BadRequest(new { error = "Message cannot be empty." });

        if (text.Length > MaxLength)
            return BadRequest(new { error = $"Message is too long (max {MaxLength} characters)." });

        var message = new Message { Text = text };
        _db.Messages.Add(message);
        await _db.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, new
        {
            id = message.Id,
            text = message.Text,
            createdAt = message.CreatedAt
        });
    }

    // HTTP GET /messages -> returns the latest saved messages (to show the POST results)
    [HttpGet("/messages")]
    public async Task<IActionResult> List()
    {
        var messages = await _db.Messages
            .AsNoTracking()
            .OrderByDescending(m => m.Id)
            .Take(20)
            .Select(m => new { id = m.Id, text = m.Text, createdAt = m.CreatedAt })
            .ToListAsync();

        return Json(messages);
    }
}
