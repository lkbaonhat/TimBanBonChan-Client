package com.timbanbonchan.client;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.PopupMenu;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SearchView;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import java.util.ArrayList;
import java.util.List;

/**
 * Activity to display contacts list with popup menu for group creation
 */
public class ContactsActivity extends AppCompatActivity {
    private static final int CREATE_GROUP_REQUEST_CODE = 1001;
    
    private RecyclerView recyclerViewContacts;
    private ContactsAdapter contactsAdapter;
    private List<Contact> contactsList;
    private List<Contact> filteredContactsList;
    private SearchView searchView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contacts);

        // Initialize views
        initializeViews();
        
        // Setup contacts data
        setupContactsData();
        
        // Setup RecyclerView
        setupRecyclerView();
        
        // Setup action bar
        setupActionBar();
    }

    private void initializeViews() {
        recyclerViewContacts = findViewById(R.id.recyclerViewContacts);
    }

    private void setupActionBar() {
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("Danh bạ");
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }

    private void setupContactsData() {
        contactsList = new ArrayList<>();
        // Sample data - In real app, this would come from database or API
        contactsList.add(new Contact(1, "Nguyễn Văn An", "0901234567", "an.nguyen@email.com", null));
        contactsList.add(new Contact(2, "Trần Thị Bình", "0907654321", "binh.tran@email.com", null));
        contactsList.add(new Contact(3, "Lê Văn Cường", "0912345678", "cuong.le@email.com", null));
        contactsList.add(new Contact(4, "Phạm Thị Dung", "0987654321", "dung.pham@email.com", null));
        contactsList.add(new Contact(5, "Hoàng Văn Em", "0923456789", "em.hoang@email.com", null));
        contactsList.add(new Contact(6, "Vũ Thị Phương", "0934567890", "phuong.vu@email.com", null));
        contactsList.add(new Contact(7, "Đặng Văn Giang", "0945678901", "giang.dang@email.com", null));
        contactsList.add(new Contact(8, "Ngô Thị Hồng", "0956789012", "hong.ngo@email.com", null));
        
        filteredContactsList = new ArrayList<>(contactsList);
    }

    private void setupRecyclerView() {
        contactsAdapter = new ContactsAdapter(this, filteredContactsList);
        recyclerViewContacts.setLayoutManager(new LinearLayoutManager(this));
        recyclerViewContacts.setAdapter(contactsAdapter);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_contacts, menu);
        
        // Setup search functionality
        MenuItem searchItem = menu.findItem(R.id.action_search);
        searchView = (SearchView) searchItem.getActionView();
        
        if (searchView != null) {
            searchView.setQueryHint("Tìm kiếm liên hệ...");
            searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
                @Override
                public boolean onQueryTextSubmit(String query) {
                    return false;
                }

                @Override
                public boolean onQueryTextChange(String newText) {
                    filterContacts(newText);
                    return true;
                }
            });
        }
        
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int itemId = item.getItemId();
        
        if (itemId == android.R.id.home) {
            finish();
            return true;
        } else if (itemId == R.id.action_more) {
            showPopupMenu();
            return true;
        } else if (itemId == R.id.action_search) {
            return true;
        }
        
        return super.onOptionsItemSelected(item);
    }

    private void showPopupMenu() {
        // Create popup menu anchored to the toolbar
        PopupMenu popupMenu = new PopupMenu(this, findViewById(R.id.action_more));
        popupMenu.getMenuInflater().inflate(R.menu.popup_menu_contacts, popupMenu.getMenu());
        
        popupMenu.setOnMenuItemClickListener(menuItem -> {
            if (menuItem.getItemId() == R.id.menu_create_group) {
                navigateToCreateGroup();
                return true;
            }
            return false;
        });
        
        popupMenu.show();
    }

    private void navigateToCreateGroup() {
        Intent intent = new Intent(this, CreateGroupActivity.class);
        intent.putExtra("contacts_list", (ArrayList<Contact>) contactsList);
        startActivityForResult(intent, CREATE_GROUP_REQUEST_CODE);
    }

    private void filterContacts(String query) {
        filteredContactsList.clear();
        
        if (query.isEmpty()) {
            filteredContactsList.addAll(contactsList);
        } else {
            String lowerCaseQuery = query.toLowerCase().trim();
            for (Contact contact : contactsList) {
                if (contact.getName().toLowerCase().contains(lowerCaseQuery) ||
                    contact.getPhoneNumber().contains(lowerCaseQuery) ||
                    (contact.getEmail() != null && contact.getEmail().toLowerCase().contains(lowerCaseQuery))) {
                    filteredContactsList.add(contact);
                }
            }
        }
        
        contactsAdapter.notifyDataSetChanged();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        
        if (requestCode == CREATE_GROUP_REQUEST_CODE && resultCode == RESULT_OK) {
            if (data != null) {
                String groupName = data.getStringExtra("group_name");
                int selectedCount = data.getIntExtra("selected_count", 0);
                
                Toast.makeText(this, 
                    "Đã tạo nhóm '" + groupName + "' với " + selectedCount + " thành viên", 
                    Toast.LENGTH_LONG).show();
            }
        }
    }
}