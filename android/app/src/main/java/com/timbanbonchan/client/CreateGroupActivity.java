package com.timbanbonchan.client;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import java.util.ArrayList;
import java.util.List;

/**
 * Activity for creating a group by selecting multiple contacts
 */
public class CreateGroupActivity extends AppCompatActivity implements CreateGroupAdapter.OnContactSelectionListener {
    
    private RecyclerView recyclerViewSelectableContacts;
    private CreateGroupAdapter createGroupAdapter;
    private List<Contact> contactsList;
    private List<Contact> selectedContacts;
    private EditText editTextGroupName;
    private TextView textViewSelectedCount;
    private FloatingActionButton fabCreateGroup;
    private Button buttonSelectAll;
    private Button buttonDeselectAll;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_create_group);

        // Initialize views
        initializeViews();
        
        // Get contacts from intent
        getContactsFromIntent();
        
        // Setup RecyclerView
        setupRecyclerView();
        
        // Setup action bar
        setupActionBar();
        
        // Setup click listeners
        setupClickListeners();
        
        // Update UI
        updateSelectedCount();
    }

    private void initializeViews() {
        recyclerViewSelectableContacts = findViewById(R.id.recyclerViewSelectableContacts);
        editTextGroupName = findViewById(R.id.editTextGroupName);
        textViewSelectedCount = findViewById(R.id.textViewSelectedCount);
        fabCreateGroup = findViewById(R.id.fabCreateGroup);
        buttonSelectAll = findViewById(R.id.buttonSelectAll);
        buttonDeselectAll = findViewById(R.id.buttonDeselectAll);
    }

    private void setupActionBar() {
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Tạo nhóm");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    @SuppressWarnings("unchecked")
    private void getContactsFromIntent() {
        Intent intent = getIntent();
        if (intent != null && intent.hasExtra("contacts_list")) {
            contactsList = (ArrayList<Contact>) intent.getSerializableExtra("contacts_list");
        }
        
        if (contactsList == null) {
            contactsList = new ArrayList<>();
        }
        
        selectedContacts = new ArrayList<>();
        
        // Reset selection state for all contacts
        for (Contact contact : contactsList) {
            contact.setSelected(false);
        }
    }

    private void setupRecyclerView() {
        createGroupAdapter = new CreateGroupAdapter(this, contactsList, this);
        recyclerViewSelectableContacts.setLayoutManager(new LinearLayoutManager(this));
        recyclerViewSelectableContacts.setAdapter(createGroupAdapter);
    }

    private void setupClickListeners() {
        fabCreateGroup.setOnClickListener(v -> createGroup());
        
        buttonSelectAll.setOnClickListener(v -> selectAllContacts());
        
        buttonDeselectAll.setOnClickListener(v -> deselectAllContacts());
    }

    private void selectAllContacts() {
        selectedContacts.clear();
        for (Contact contact : contactsList) {
            contact.setSelected(true);
            selectedContacts.add(contact);
        }
        createGroupAdapter.notifyDataSetChanged();
        updateSelectedCount();
    }

    private void deselectAllContacts() {
        selectedContacts.clear();
        for (Contact contact : contactsList) {
            contact.setSelected(false);
        }
        createGroupAdapter.notifyDataSetChanged();
        updateSelectedCount();
    }

    @Override
    public void onContactSelected(Contact contact, boolean isSelected) {
        contact.setSelected(isSelected);
        
        if (isSelected) {
            if (!selectedContacts.contains(contact)) {
                selectedContacts.add(contact);
            }
        } else {
            selectedContacts.remove(contact);
        }
        
        updateSelectedCount();
    }

    private void updateSelectedCount() {
        int selectedCount = selectedContacts.size();
        textViewSelectedCount.setText("Đã chọn: " + selectedCount + " liên hệ");
        
        // Enable/disable create button based on selection
        fabCreateGroup.setEnabled(selectedCount > 0);
    }

    private void createGroup() {
        String groupName = editTextGroupName.getText().toString().trim();
        
        // Validate input
        if (TextUtils.isEmpty(groupName)) {
            editTextGroupName.setError("Vui lòng nhập tên nhóm");
            editTextGroupName.requestFocus();
            return;
        }
        
        if (selectedContacts.isEmpty()) {
            Toast.makeText(this, "Vui lòng chọn ít nhất một liên hệ", Toast.LENGTH_SHORT).show();
            return;
        }
        
        // In a real app, you would save the group to database here
        // For now, we'll just show a success message and return the result
        
        Toast.makeText(this, 
            "Đang tạo nhóm '" + groupName + "' với " + selectedContacts.size() + " thành viên...", 
            Toast.LENGTH_SHORT).show();
        
        // Prepare result data
        Intent resultIntent = new Intent();
        resultIntent.putExtra("group_name", groupName);
        resultIntent.putExtra("selected_count", selectedContacts.size());
        resultIntent.putExtra("selected_contacts", (ArrayList<Contact>) selectedContacts);
        
        setResult(RESULT_OK, resultIntent);
        finish();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        // Show confirmation dialog if user has made selections
        if (!selectedContacts.isEmpty() || !TextUtils.isEmpty(editTextGroupName.getText().toString().trim())) {
            new androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle("Xác nhận")
                .setMessage("Bạn có chắc chắn muốn hủy tạo nhóm? Tất cả thông tin đã nhập sẽ bị mất.")
                .setPositiveButton("Có", (dialog, which) -> {
                    super.onBackPressed();
                })
                .setNegativeButton("Không", null)
                .show();
        } else {
            super.onBackPressed();
        }
    }
}