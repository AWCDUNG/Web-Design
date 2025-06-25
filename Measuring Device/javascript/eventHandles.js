document.addEventListener('DOMContentLoaded', function() {
    const dropdownBtn = document.getElementById('dropdown-btn');
    const dropdownContent = document.getElementById('dropdown-content');
    const dropdown = document.querySelector('.dropdown');
    const campusText = document.querySelector('.campus-text');

    // Toggle dropdown
    dropdownBtn.addEventListener('click', function() {
        dropdown.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });

    // Handle dropdown item selection
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            dropdownItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update button text
            const selectedText = this.textContent.trim();
            campusText.textContent = selectedText;
            
            // Close dropdown
            dropdown.classList.remove('active');
            
            // Optional: Handle campus change (reload data, etc.)
            const campusId = this.getAttribute('data-campus');
            handleCampusChange(campusId);
        });
    });
});

// Function to handle campus change
function handleCampusChange(campusId) {
    console.log('Selected campus:', campusId);
    // Thêm code để thay đổi dữ liệu theo campus được chọn
    // Ví dụ: gọi API mới, cập nhật biểu đồ, etc.
}
