const commentInput = document.getElementById("commentInput");
const charCounter = document.getElementById("charCounter");
const commentsContainer = document.getElementById("commentsContainer");

document.addEventListener("DOMContentLoaded", loadCommentsFromLocalStorage);

// Character Counter for New Comment
commentInput.addEventListener("input", () => {
  const remaining = 250 - commentInput.value.length;
  charCounter.textContent = `${remaining} characters left`;
});

// Load Comments from Local Storage
function loadCommentsFromLocalStorage() {
  const comments = JSON.parse(localStorage.getItem("comments")) || [];
  comments.forEach((comment) => {
    const commentDiv = createCommentElement(comment.text, comment.id, comment.replies);
    commentsContainer.appendChild(commentDiv);
  });
}

// Save Comments to Local Storage
function saveCommentsToLocalStorage() {
  const comments = Array.from(commentsContainer.children).map((commentDiv) => {
    const text = commentDiv.querySelector(".comment-text").textContent;
    const id = commentDiv.id;
    const replies = Array.from(commentDiv.querySelector(".replies").children).map(replyDiv => ({
      text: replyDiv.querySelector(".comment-text").textContent,
      id: replyDiv.id
    }));
    return { text, id, replies };
  });
  localStorage.setItem("comments", JSON.stringify(comments));
}

// Add a New Comment
function addComment() {
  const commentText = commentInput.value.trim();
  if (commentText) {
    const commentId = `comment-${Date.now()}`;
    const commentDiv = createCommentElement(commentText, commentId);
    commentsContainer.appendChild(commentDiv);
    commentInput.value = "";
    charCounter.textContent = "250 characters left";
    saveCommentsToLocalStorage();
  }
}

// Create Comment or Reply Element
function createCommentElement(text, id = `comment-${Date.now()}`, replies = []) {
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("p-4", "border", "border-gray-200", "rounded-md", "bg-gray-50", "space-y-3", "relative");
  commentDiv.id = id;

  commentDiv.innerHTML = `
        <p class="text-gray-700 comment-text">${text}</p>
        <div class="flex space-x-3">
          <button onclick="editComment('${id}')" class="text-green-500 font-medium text-sm">Edit</button>
          <button onclick="deleteComment('${id}')" class="text-red-500 font-medium text-sm">Delete</button>
          <button onclick="toggleReplyInput('${id}')" class="text-blue-500 font-medium text-sm">Reply</button>
        </div>
        <div class="replies ml-6 space-y-3"></div>
      `;

  replies.forEach(reply => {
    const replyDiv = createCommentElement(reply.text, reply.id, []);
    commentDiv.querySelector(".replies").appendChild(replyDiv);
  });

  return commentDiv;
}

// Edit Comment or Reply
function editComment(commentId) {
  const commentDiv = document.getElementById(commentId);
  const commentText = commentDiv.querySelector(".comment-text");
  const currentText = commentText.textContent;
  const newInput = document.createElement("textarea");
  newInput.classList.add("w-full", "p-2", "border", "rounded", "resize-none", "focus:outline-none", "focus:ring-2", "focus:ring-blue-500");
  newInput.value = currentText;
  commentText.replaceWith(newInput);

  const editButton = commentDiv.querySelector("button");
  editButton.textContent = "Post";
  editButton.setAttribute("onclick", `postEdit('${commentId}')`);
}

// Post Edited Comment or Reply
function postEdit(commentId) {
  const commentDiv = document.getElementById(commentId);
  const newText = commentDiv.querySelector("textarea").value;
  const newCommentText = document.createElement("p");
  newCommentText.classList.add("text-gray-700", "comment-text");
  newCommentText.textContent = newText;
  commentDiv.querySelector("textarea").replaceWith(newCommentText);

  const editButton = commentDiv.querySelector("button");
  editButton.textContent = "Edit";
  editButton.setAttribute("onclick", `editComment('${commentId}')`);
  saveCommentsToLocalStorage();
}

// Delete Comment or Reply
function deleteComment(commentId) {
  const commentDiv = document.getElementById(commentId);
  commentDiv.remove();
  saveCommentsToLocalStorage();
}

// Toggle Reply Input
function toggleReplyInput(commentId) {
  const commentDiv = document.getElementById(commentId);
  let replyInputDiv = commentDiv.querySelector(".reply-input");

  if (!replyInputDiv) {
    replyInputDiv = document.createElement("div");
    replyInputDiv.classList.add("reply-input", "mt-3");
    replyInputDiv.innerHTML = `
          <textarea maxlength="250" class="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" rows="2" placeholder="Write a reply..."></textarea>
          <p class="text-right text-gray-500 text-sm">250 characters left</p>
          <button onclick="addReply('${commentId}')" class="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Post Reply</button>
        `;
    commentDiv.querySelector(".replies").appendChild(replyInputDiv);

    const replyTextarea = replyInputDiv.querySelector("textarea");
    const replyCharCounter = replyInputDiv.querySelector("p");
    replyTextarea.addEventListener("input", () => {
      const remaining = 250 - replyTextarea.value.length;
      replyCharCounter.textContent = `${remaining} characters left`;
    });
  } else {
    replyInputDiv.remove();
  }
}

// Add Reply with Infinite Nesting
function addReply(parentId) {
  const parentDiv = document.getElementById(parentId);
  const replyInput = parentDiv.querySelector(".reply-input textarea");
  const replyText = replyInput.value.trim();

  if (replyText) {
    const replyId = `reply-${Date.now()}`;
    const replyDiv = createCommentElement(replyText, replyId, []);
    parentDiv.querySelector(".replies").appendChild(replyDiv);
    replyInput.value = "";
    replyInput.nextElementSibling.textContent = "250 characters left";
    parentDiv.querySelector(".reply-input").remove();
    saveCommentsToLocalStorage();
  }
}
