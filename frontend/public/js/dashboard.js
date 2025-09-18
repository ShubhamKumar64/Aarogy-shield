// Dashboard specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Action buttons functionality
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('span').textContent;
            alert(`You selected: ${action}`);
        });
    });
    
    // Update progress bars dynamically (example)
    updateProgressBars();
});

function updateProgressBars() {
    // This function can be used to update progress bars with real data
    console.log('Progress bars updated');
}