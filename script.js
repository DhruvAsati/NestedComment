const commentInput = document.getElementById("commentInput");
const charCounter = document.getElementById("charCounter");

// Character Counter for New Comment
commentInput.addEventListener("input", () => {
  const remaining = 250 - commentInput.value.length;
  charCounter.textContent = `${remaining} characters left`;
});

// Add a New Comment
function addComment() {
  const commentText = commentInput.value.trim();
  if (commentText) {
    const commentDiv = createCommentElement(commentText);
    document.getElementById("commentsContainer").appendChild(commentDiv);
    commentInput.value = "";
    charCounter.textContent = "250 characters left";
  }
}

// Create Comment or Reply Element
function createCommentElement(text, level = 1) {
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("p-4", "border", "border-gray-200", "rounded-md", "bg-gray-50", "space-y-3", "relative");
  commentDiv.setAttribute("data-level", level);

  commentDiv.innerHTML = `
    <p class="text-gray-700 comment-text">${text}</p>
    <div class="flex space-x-3">
      <button onclick="editComment(this)" class="text-green-500 font-medium text-sm">Edit</button>
      <button onclick="deleteComment(this)" class="text-red-500 font-medium text-sm">Delete</button>
      <button onclick="toggleReplyInput(this)" class="text-blue-500 font-medium text-sm">Reply</button>
    </div>
    <div class="replies ml-6 space-y-3"></div>
  `;

  return commentDiv;
}

// Edit Comment or Reply
function editComment(button) {
  const commentText = button.closest("div").previousElementSibling;
  const currentText = commentText.textContent;
  const newInput = document.createElement("textarea");
  newInput.classList.add("w-full", "p-2", "border", "rounded", "resize-none", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500");
  newInput.value = currentText;
  commentText.replaceWith(newInput);

  // Update buttons
  button.textContent = "Post";
  button.setAttribute("onclick", "postEdit(this)");
}

// Post Edited Comment or Reply
function postEdit(button) {
  const newText = button.closest("div").previousElementSibling.value;
  const newCommentText = document.createElement("p");
  newCommentText.classList.add("text-gray-700", "comment-text");
  newCommentText.textContent = newText;
  button.closest("div").previousElementSibling.replaceWith(newCommentText);

  // Restore button text
  button.textContent = "Edit";
  button.setAttribute("onclick", "editComment(this)");
}

// Delete Comment or Reply
function deleteComment(button) {
  button.closest(".p-4").remove();
}

// Toggle Reply Input
function toggleReplyInput(button) {
  const commentDiv = button.closest(".p-4");
  const replyInputDiv = commentDiv.querySelector(".reply-input");

  if (!replyInputDiv) {
    const replyInput = document.createElement("div");
    replyInput.classList.add("reply-input", "mt-3");
    replyInput.innerHTML = `
      <textarea maxlength="250" class="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" placeholder="Write a reply..."></textarea>
      <p class="text-right text-gray-500 text-sm">250 characters left</p>
      <button onclick="addReply(this)" class="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Post</button>
    `;
    commentDiv.querySelector(".replies").appendChild(replyInput);

    // Character counter for reply input
    const replyTextarea = replyInput.querySelector("textarea");
    const replyCharCounter = replyInput.querySelector("p");
    replyTextarea.addEventListener("input", () => {
      const remaining = 250 - replyTextarea.value.length;
      replyCharCounter.textContent = `${remaining} characters left`;
    });
  } else {
    replyInputDiv.remove();
  }
}


// Add Reply with Edit, Delete, and Reply Options
function addReply(button, level) {
  const replyInput = button.previousElementSibling.previousElementSibling;
  const replyText = replyInput.value.trim();
  if (replyText) {
    const replyDiv = createCommentElement(replyText, level);
    const repliesContainer = button.closest(".replies");
    repliesContainer.appendChild(replyDiv);
    replyInput.value = "";
    button.closest(".reply-input").remove();

    // Handle reply visibility
    limitRepliesVisibility(repliesContainer);
  }
}
